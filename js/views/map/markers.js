/*
  Seuls les hébergements portent une icône (🏠, même glyph que leur entrée de filtre) ; les lieux &
  activités restent un simple point — le glyph par type de couleur ne servait qu'à distinguer des
  types que la couleur seule rendait déjà peu lisibles à cette taille. Chaque marqueur porte son nom
  en étiquette permanente à côté du point.
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
  if (routeBuilder.active) drawRouteBuilderLine(leafletMap);
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
  addMapPinMarker(map, point, mapPinIcon('house'), accommodationPopup(a), a.name);
}

function addAttractionMarker(map, a, bounds) {
  const point = markerPoint(a, bounds);
  if (!point) return;
  addMapPinMarker(map, point, mapDotIcon(), attractionPopup(a), a.name);
}

function mapPinIcon(icon) {
  return L.divIcon({
    className: 'map-type-pin',
    html: `<span>${svgIcon(icon)}</span>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -14],
  });
}

function mapDotIcon() {
  return L.divIcon({
    className: 'map-dot-pin',
    html: '<span></span>',
    iconSize: [12, 12],
    iconAnchor: [6, 6],
    popupAnchor: [0, -8],
  });
}

function addMapPinMarker(map, point, icon, popupHtml, name) {
  const marker = L.marker(point, { icon }).addTo(map);
  marker.bindTooltip(escapeHtml(name), {
    permanent: true,
    direction: 'right',
    offset: [8, 0],
    className: 'map-marker-label',
  });
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
    if (routeBuilder.active) {
      addRouteBuilderPoint(point[0], point[1], name);
      return;
    }
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
