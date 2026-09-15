/*
  Le même bouton « Filtrer » que les listes, avec un bloc par collection tracée : la case qui la met
  à l'écran, et sous elle sa propre pile de niveaux. Décocher la collection cache aussi ses
  niveaux — ils ne filtrent plus rien.
  Le scénario, lui, reste dans l'en-tête : il trace le trajet et porte son message d'état, qu'un
  panneau fermé rendrait invisible.
*/
function mapFilterButton() {
  return toolbarPanel({
    key: 'filter',
    icon: svgIcon('funnel'),
    label: 'Filtrer',
    count: mapFilterCount(),
    body: /* HTML */ `<div class="filter-panel">
      ${MAP_KINDS.map(mapResourceBlock).join('')}
      <div class="filter-block">
        <label class="filter-option"
          ><input
            type="checkbox"
            ${mapFilters.favOnly ? 'checked' : ''}
            onchange="toggleMapFavOnly()"
          />${svgIcon('star', { fill: true })} Favoris uniquement</label
        >
      </div>
    </div>`,
  });
}

// Une collection retirée de la carte compte autant qu'un niveau : c'est ce qui n'est plus montré.
function mapFilterCount() {
  const levels = MAP_KINDS.reduce((total, kind) => total + activeFilterCount(mapScope(kind)), 0);
  const hidden = MAP_KINDS.filter((kind) => !mapFilters.shown[kind]).length;
  return levels + hidden + (mapFilters.favOnly ? 1 : 0);
}

function mapResourceBlock(kind) {
  const resource = listResource(kind);
  const shown = mapFilters.shown[kind];
  return /* HTML */ `<div class="filter-block">
    <label class="filter-option map-resource">
      <input type="checkbox" ${shown ? 'checked' : ''} onchange="toggleMapKind('${kind}')" />
      <span class="map-resource-icon">${resource.icon}</span>
      <span class="map-resource-label">${escapeHtml(resource.label)}</span>
    </label>
    ${shown ? filterLevelsBlock(mapScope(kind)) : ''}
  </div>`;
}

function mapScenarioSelect() {
  return /* HTML */ `<select class="map-scenario-select" onchange="setMapScenario(this.value)">
    <option value="">Tous les lieux</option>
    ${activeScenarios(ofCurrentTravel(state.scenarios))
      .map(
        (s) =>
          `<option value="${s.id}" ${mapFilters.scenarioId === s.id ? 'selected' : ''}>${escapeHtml(s.name)}</option>`,
      )
      .join('')}
  </select>`;
}
