function scenarioMapBlock(scenario) {
  const hasPlaces = scenario.steps.some((st) => coordsFor(st));
  return /* HTML */ `<div class="scenario-map-block">
    <div class="acc-recap-title">Trajet</div>
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

function scenarioMapToggleBtn() {
  return /* HTML */ `<button class="btn-ghost btn btn-small" onclick="toggleScenarioMap()">
    ${prefs.showScenarioMap ? '🗺️ Masquer la carte' : '🗺️ Afficher la carte'}
  </button>`;
}

function toggleScenarioMap() {
  prefs.showScenarioMap = !prefs.showScenarioMap;
  persistPrefs();
  render();
}

function initScenarioDetailMap() {
  const el = document.getElementById('scenario-map');
  if (!el || typeof L === 'undefined') return;
  if (scenarioDetailMap) {
    scenarioDetailMap.remove();
    scenarioDetailMap = null;
  }
  const scenario = getScenario(activeScenarioId);
  if (!scenario) return;

  scenarioDetailMap = createLeafletMap('scenario-map');
  const points = drawScenarioOnMap(scenarioDetailMap, scenario, 'scenario-route-notice', '');
  fitToPoints(scenarioDetailMap, points);
}
