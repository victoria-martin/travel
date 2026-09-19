/*
  La colonne à gauche de la carte : la liste des scénarios, en clair plutôt qu'un select — un clic
  suffit, pas d'ouverture. Un scénario choisi trace son trajet (markers.js) et ajoute la bascule
  Tous les lieux / Lieux du scénario, pour comparer l'itinéraire retenu au reste des possibles.
*/
function mapScenarioPanel() {
  return /* HTML */ `<div class="map-side-panel">
    <div class="map-side-title">Scénarios</div>
    <div class="map-scenario-list">
      ${mapScenarioItem(null, 'compass', 'Tous les lieux')}
      ${activeScenarios(ofCurrentTravel(state.scenarios))
        .map((s) => mapScenarioItem(s.id, 'map', s.name))
        .join('')}
    </div>
  </div>
  ${mapFilters.scenarioId ? mapScenarioScopeToggle() : ''}`;
}

function mapScenarioItem(id, icon, label) {
  const active = (mapFilters.scenarioId || null) === id;
  return /* HTML */ `<button
    class="map-scenario-item ${active ? 'active' : ''}"
    onclick="setMapScenario('${id || ''}')"
  >
    <span class="map-scenario-item-icon">${svgIcon(icon)}</span>
    <span class="map-scenario-item-label">${escapeHtml(label)}</span>
  </button>`;
}

function mapScenarioScopeToggle() {
  return toolbarToggleGroup([
    {
      label: 'Tous les lieux',
      icon: svgIcon('map'),
      active: !mapFilters.scenarioOnly,
      onclick: 'setMapScenarioOnly(false)',
    },
    {
      label: 'Lieux du scénario',
      icon: svgIcon('compass'),
      active: mapFilters.scenarioOnly,
      onclick: 'setMapScenarioOnly(true)',
    },
  ]);
}
