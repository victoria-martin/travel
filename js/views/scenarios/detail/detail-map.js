/*
  Le tracé s'affiche partout où l'écran pose un canevas — le panneau latéral, le pied de la liste
  d'étapes — et chacun porte son id, donc sa propre instance Leaflet et son propre emplacement de
  message. Quitter un emplacement le démonte, y revenir le refait.
*/
let scenarioDetailMaps = [];

function scenarioMapBlock(scenario, id) {
  const hasPlaces = visibleSteps(scenario).some((st) => coordsFor(st));
  return /* HTML */ `<div class="scenario-map-block">
    ${
      hasPlaces
        ? /* HTML */ `<div class="scenario-map-canvas" id="${id}"></div>
            <div id="${id}-notice" class="scenario-route-notice"></div>`
        : /* HTML */ `<div class="scenario-map-empty">
            Rattache à tes étapes des lieux géolocalisés pour voir le trajet.
          </div>`
    }
  </div>`;
}

function initScenarioDetailMaps() {
  scenarioDetailMaps.forEach((map) => map.remove());
  scenarioDetailMaps = [];
  const scenario = getScenario(activeScenarioId);
  if (!scenario || typeof L === 'undefined') return;
  document.querySelectorAll('.scenario-map-canvas').forEach((el) => {
    const map = createLeafletMap(el.id);
    scenarioDetailMaps.push(map);
    const bounds = drawScenarioOnMap(map, scenario, `${el.id}-notice`, '');
    ofCurrentTravel(state.attractions).forEach((a) => addAttractionMarker(map, a, bounds));
    fitToPoints(map, bounds);
  });
}
