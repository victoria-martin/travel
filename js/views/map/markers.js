/*
  Un hébergement est un disque de la couleur de son type, une attraction une pastille portant
  l'emoji du sien : la couleur dit la famille, la forme dit la collection.
*/
function initMap() {
  const el = document.getElementById('map');
  if (!el || typeof L === 'undefined') return;
  if (leafletMap) {
    leafletMap.remove();
    leafletMap = null;
  }

  leafletMap = createLeafletMap('map');
  const scenario = mapFilters.scenarioId ? getScenario(mapFilters.scenarioId) : null;
  if (scenario) drawScenarioOnMap(leafletMap, scenario, 'route-notice', ROUTE_HELP);
  const chosen = scenario ? scenarioSelection(scenario) : null;
  const bounds = [];

  ofCurrentTravel(state.accommodations).forEach((a) => {
    if (!keptOnMap('hebergements', a)) return;
    if (chosen && !chosen.accommodationIds.has(a.id)) return;
    addAccommodationMarker(a, bounds);
  });

  ofCurrentTravel(state.attractions).forEach((a) => {
    if (!keptOnMap('attractions', a)) return;
    if (chosen && !chosen.attractionIds.has(a.id)) return;
    addAttractionMarker(a, bounds);
  });

  fitToPoints(leafletMap, bounds);
}

// Only the retained itinerary is drawn: its steps carry the stays, and their lines the attractions.
function scenarioSelection(scenario) {
  const accommodationIds = new Set(
    visibleSteps(scenario)
      .map((step) => step.accommodationId)
      .filter(Boolean),
  );
  const attractionIds = new Set(
    scenarioAttractionLines(scenario)
      .map((line) => line.attractionId)
      .filter(Boolean),
  );
  return { accommodationIds, attractionIds };
}

function markerPoint(item, bounds) {
  if (!item.lat || !item.lng) return null;
  const point = [parseFloat(item.lat), parseFloat(item.lng)];
  bounds.push(point);
  return point;
}

function addAccommodationMarker(a, bounds) {
  const point = markerPoint(a, bounds);
  if (!point) return;
  L.circleMarker(point, {
    radius: 8,
    color: '#24312B',
    weight: 1,
    fillColor: accType(a.type).color,
    fillOpacity: 0.9,
  })
    .bindPopup(accommodationPopup(a))
    .addTo(leafletMap);
}

function addAttractionMarker(a, bounds) {
  const point = markerPoint(a, bounds);
  if (!point) return;
  const type = attractionType(a.type);
  L.marker(point, {
    icon: L.divIcon({
      className: '',
      html: `<span class="map-pin" style="background:${type.color};">${type.emoji}</span>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12],
    }),
  })
    .bindPopup(attractionPopup(a))
    .addTo(leafletMap);
}

function accommodationPopup(a) {
  const place = [accTypeKey(a.type) && accType(a.type).label, escapeHtml(a.city)]
    .filter(Boolean)
    .join(' · ');
  const price = a.price ? `<br/>${escapeHtml(a.price)} ${accommodationPriceUnit(a)}` : '';
  return `<strong>${popupName(a, a.link || a.bookingLink)}</strong><br/>${place}${price}`;
}

function attractionPopup(a) {
  const type = attractionType(a.type);
  const place = [attractionTypeKey(a.type) && type.label, escapeHtml(a.city)]
    .filter(Boolean)
    .join(' · ');
  const price = priceRange(a) || '';
  return `<strong>${popupName(a, a.link)}</strong><br/>${place}${price ? `<br/>${price}` : ''}`;
}

function popupName(item, url) {
  const name = `${item.favorite ? svgIcon('star', { fill: true }) + ' ' : ''}${escapeHtml(item.name)}`;
  return url ? externalLink(url, name) : name;
}
