/*
  Seuls les hébergements portent une icône (🏠, même glyph que leur entrée de filtre) ; les lieux &
  activités restent un simple point — le glyph par type de couleur ne servait qu'à distinguer des
  types que la couleur seule rendait déjà peu lisibles à cette taille. Chaque marqueur porte son nom
  en étiquette permanente à côté du point.
  Le popup s'ouvre au survol et se referme quand le curseur quitte le point et le popup ; un clic
  l'épingle, il reste alors à l'écran jusqu'à ce qu'on le ferme (sa croix, ou un clic ailleurs).
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

  ofCurrentTravel(state.villes).forEach((v) => addVilleMarker(leafletMap, v, bounds));

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
  addMapPinMarker(
    map,
    point,
    mapPinIcon('house'),
    accommodationPopup(a),
    a.name,
    a.id,
    'accommodation',
  );
}

function addAttractionMarker(map, a, bounds) {
  const point = markerPoint(a, bounds);
  if (!point) return;
  addMapPinMarker(map, point, mapDotIcon(), attractionPopup(a), a.name, a.id, 'attraction');
}

function addVilleMarker(map, v, bounds) {
  const point = markerPoint(v, bounds);
  if (!point) return;
  addMapPinMarker(map, point, mapPinIcon('map-pin'), villePopup(v), v.name, v.id, 'ville');
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

function addMapPinMarker(map, point, icon, popupHtml, name, id, kind) {
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
  let overMarker = false;
  let overPopup = false;
  let closeTimer = null;
  const keepPopupOpen = () => {
    if (closeTimer) clearTimeout(closeTimer);
  };
  const closeOnHoverEnd = () => {
    keepPopupOpen();
    closeTimer = setTimeout(() => {
      if (!pinned && !overMarker && !overPopup) marker.closePopup();
    }, 120);
  };
  marker.on('mouseover', () => {
    overMarker = true;
    keepPopupOpen();
    if (!pinned) marker.openPopup();
  });
  marker.on('mouseout', () => {
    overMarker = false;
    closeOnHoverEnd();
  });
  marker.on('popupopen', () => {
    const popup = marker.getPopup().getElement();
    if (!popup) return;
    popup.addEventListener('mouseenter', () => {
      overPopup = true;
      keepPopupOpen();
    });
    popup.addEventListener('mouseleave', () => {
      overPopup = false;
      closeOnHoverEnd();
    });
  });
  marker.on('click', () => {
    if (routeBuilder.active) {
      addRouteBuilderPoint(point[0], point[1], name, id, kind);
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
  const googleMaps = externalLink(googleMapsPlaceUrl(a.address || a.name), 'Google Maps');
  return `<strong>${popupName(a, a.link)}</strong><br/>${place}${price ? `<br/>${price}` : ''}
    <div class="map-popup-links">
      ${googleMaps}
      ${mapAttractionScenarioActions(a.id)}
    </div>`;
}

function mapAttractionScenarioActions(attractionId) {
  const currentScenario = mapAttractionCurrentScenario();
  return `${currentScenario ? mapAttractionCurrentActions(attractionId, currentScenario) : ''}
    ${mapAttractionOtherScenarioActions(attractionId, currentScenario)}`;
}

function attachMapAttractionToStep(scenarioId, stepId, attractionId) {
  closeOpenInlineMenu();
  const attraction = getAttraction(attractionId);
  if (!attraction) return;
  const step = getStep(scenarioId, stepId);
  attachExtraAttraction(scenarioId, stepId, attraction.id);
  showToast(`Ajouté à « ${step.name || 'l’étape'} »`);
}

function addMapAttractionAutomatically(scenarioId, attractionId) {
  const scenario = getScenario(scenarioId);
  if (!scenario) return;
  const attraction = getAttraction(attractionId);
  if (!attraction) return;
  const step = nearestAccommodationStep(scenario, attraction);
  if (!step) return showToast('Aucun hébergement localisé dans ce scénario');
  attachExtraAttraction(scenario.id, step.id, attractionId);
  showToast(`Ajouté à « ${step.name || 'l’étape'} »`);
}

function mapAttractionCurrentScenario() {
  if (view === 'scenario-detail') return getScenario(activeScenarioId);
  return mapFilters.scenarioId ? getScenario(mapFilters.scenarioId) : chosenScenario();
}

function mapAttractionCurrentActions(attractionId, scenario) {
  const extraArgs = `,'${attractionId}'`;
  const steps = scenarioStepPickerGroup(scenario, 'attachMapAttractionToStep', extraArgs);
  return `${inlineDropdown(
    `map-attraction-step:${attractionId}:${scenario.id}`,
    'map-popup-dropdown',
    `<summary class="map-popup-action">Ajouter à une étape</summary>
      <div class="inline-menu">${steps || '<div class="inline-menu-group">Aucune étape</div>'}</div>`,
  )}
  <button type="button" class="map-popup-action"
    onclick="addMapAttractionAutomatically('${scenario.id}','${attractionId}')">
    Ajouter automatiquement
  </button>`;
}

function mapAttractionOtherScenarioActions(attractionId, currentScenario) {
  const scenarios = activeScenarios(ofCurrentTravel(state.scenarios)).filter(
    (scenario) => scenario.id !== currentScenario?.id,
  );
  if (!scenarios.length) return '';
  const selected = scenarios[0];
  return inlineDropdown(
    `map-attraction-other-scenario:${attractionId}`,
    'map-popup-dropdown',
    `<summary class="map-popup-action">Ajouter à un autre scénario</summary>
      <div class="inline-menu map-other-scenario-menu">
        <select class="map-scenario-select"
          onchange="setMapAttractionScenario('${attractionId}', this.value)">
          ${scenarios
            .map(
              (scenario) =>
                `<option value="${scenario.id}" ${scenario.id === selected.id ? 'selected' : ''}>
                  ${escapeHtml(scenario.name)}
                </option>`,
            )
            .join('')}
        </select>
        <div id="map-attraction-scenarios-${attractionId}">
          ${scenarios
            .map((scenario, index) => mapAttractionScenarioPanel(attractionId, scenario, index > 0))
            .join('')}
        </div>
      </div>`,
  );
}

function mapAttractionScenarioPanel(attractionId, scenario, hidden) {
  const extraArgs = `,'${attractionId}'`;
  const steps = scenarioStepPickerGroup(scenario, 'attachMapAttractionToStep', extraArgs);
  return `<div data-map-attraction-scenario="${scenario.id}" ${hidden ? 'hidden' : ''}>
    <div class="inline-menu-group">Ajouter à une étape</div>
    ${steps || '<div class="inline-menu-group">Aucune étape</div>'}
    <button type="button" class="map-popup-action"
      onclick="addMapAttractionAutomatically('${scenario.id}','${attractionId}')">
      Ajouter automatiquement
    </button>
  </div>`;
}

function setMapAttractionScenario(attractionId, scenarioId) {
  const menu = document.getElementById(`map-attraction-scenarios-${attractionId}`);
  if (!menu) return;
  menu.querySelectorAll('[data-map-attraction-scenario]').forEach((panel) => {
    panel.hidden = panel.dataset.mapAttractionScenario !== scenarioId;
  });
}

function villePopup(v) {
  return `<strong>${escapeHtml(v.name)}</strong>`;
}

function popupName(item, url) {
  const name = `${item.favorite ? svgIcon('star', { fill: true }) + ' ' : ''}${escapeHtml(item.name)}`;
  return url ? externalLink(url, name) : name;
}
