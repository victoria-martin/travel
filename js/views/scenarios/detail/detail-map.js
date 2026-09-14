let scenarioDetailMap = null;

function scenarioMapBlock(scenario) {
  const hasPlaces = visibleSteps(scenario).some((st) => coordsFor(st));
  return /* HTML */ `<div class="scenario-map-block">
    ${
      hasPlaces
        ? /* HTML */ `<div id="scenario-map"></div>
            <div id="scenario-route-notice" class="scenario-route-notice"></div>`
        : /* HTML */ `<div class="scenario-map-empty">
            Rattache à tes étapes des lieux géolocalisés pour voir le trajet.
          </div>`
    }
  </div>`;
}

// La carte ne vit que dans son onglet : quitter l'onglet la démonte, y revenir la refait.
function initScenarioDetailMap() {
  if (scenarioDetailMap) {
    scenarioDetailMap.remove();
    scenarioDetailMap = null;
  }
  const el = document.getElementById('scenario-map');
  if (!el || typeof L === 'undefined') return;
  const scenario = getScenario(activeScenarioId);
  if (!scenario) return;

  scenarioDetailMap = createLeafletMap('scenario-map');
  const points = drawScenarioOnMap(scenarioDetailMap, scenario, 'scenario-route-notice', '');
  fitToPoints(scenarioDetailMap, points);
}
