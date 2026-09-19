/*
  Une pastille par collection — 🏠 pour un hébergement, 🏛 pour une attraction, les mêmes icônes
  que leur entrée de filtre — teintée de la couleur de son type : la forme dit la collection, la
  couleur dit le type, un seul glyph par collection évite d'en inventer un par type.
  Le popup s'ouvre au survol et se referme en quittant le point ; un clic l'épingle, il reste alors
  à l'écran jusqu'à ce qu'on le ferme (sa croix, ou un clic ailleurs sur la carte).
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
  const chosenAccommodationIds =
    scenario && mapFilters.scenarioOnly ? scenarioAccommodationIds(scenario) : null;
  const bounds = [];

  ofCurrentTravel(state.accommodations).forEach((a) => {
    if (!keptOnMap('hebergements', a)) return;
    if (chosenAccommodationIds && !chosenAccommodationIds.has(a.id)) return;
    addAccommodationMarker(leafletMap, a, bounds);
  });

  ofCurrentTravel(state.attractions).forEach((a) => {
    if (!keptOnMap('attractions', a)) return;
    addAttractionMarker(leafletMap, a, bounds);
  });

  fitToPoints(leafletMap, bounds);
}

// « Lieux du scénario » ne restreint que les hébergements : les attractions/villes du voyage
// s'affichent toujours, comme dans « Tous les lieux ».
function scenarioAccommodationIds(scenario) {
  return new Set(
    visibleSteps(scenario)
      .map((step) => step.accommodationId)
      .filter(Boolean),
  );
}

function markerPoint(item, bounds) {
  if (!item.lat || !item.lng) return null;
  const point = [parseFloat(item.lat), parseFloat(item.lng)];
  bounds.push(point);
  return point;
}

function addAccommodationMarker(map, a, bounds) {
  const point = markerPoint(a, bounds);
  if (!point) return;
  addTypePinMarker(map, point, 'house', accType(a.type).color, accommodationPopup(a));
}

function addAttractionMarker(map, a, bounds) {
  const point = markerPoint(a, bounds);
  if (!point) return;
  addTypePinMarker(map, point, 'landmark', attractionType(a.type).color, attractionPopup(a));
}

function mapTypePinIcon(icon, color) {
  return L.divIcon({
    className: 'map-type-pin',
    html: `<span style="background:${color}">${svgIcon(icon)}</span>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -14],
  });
}

function addTypePinMarker(map, point, icon, color, popupHtml) {
  const marker = L.marker(point, { icon: mapTypePinIcon(icon, color) }).addTo(map);
  marker.bindPopup(popupHtml);
  // bindPopup attache son propre clic « toggle » : un clic fermerait ce que le survol vient
  // d'ouvrir. On le retire pour ne garder que nos trois gestes (survol, clic, croix du popup).
  marker.off('click');
  let pinned = false;
  marker.on('mouseover', () => {
    if (!pinned) marker.openPopup();
  });
  marker.on('mouseout', () => {
    if (!pinned) marker.closePopup();
  });
  marker.on('click', () => {
    pinned = true;
    marker.openPopup();
  });
  marker.on('popupclose', () => {
    pinned = false;
  });
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
