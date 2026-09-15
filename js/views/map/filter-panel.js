function mapFilterPanel() {
  const counties = distinctCounties();
  return /* HTML */ `
    ${mapTypeBlock('Hébergements', 'accommodationTypes', [
      ...Object.entries(ACCOMMODATION_TYPES),
      ['', UNSET_ACCOMMODATION_TYPE],
    ])}
    ${mapTypeBlock('Activités', 'attractionTypes', [
      ...Object.entries(ATTRACTION_TYPES),
      ['', UNSET_ATTRACTION_TYPE],
    ])}
    <div class="filter-block">
      <div class="filter-title">Province</div>
      ${
        counties.length === 0
          ? `<div class="filter-hint">Renseigne l'adresse de tes lieux pour filtrer ici.</div>`
          : counties.map(mapCountyOption).join('')
      }
    </div>
    <div class="filter-block">
      <div class="filter-title">Favoris</div>
      <label class="filter-option"
        ><input
          type="checkbox"
          ${mapFilters.favOnly ? 'checked' : ''}
          onchange="toggleMapFavOnly()"
        />${svgIcon('star', { fill: true })} Favoris uniquement</label
      >
    </div>
    <div class="filter-block">
      <div class="filter-title">Scénario</div>
      <select class="map-scenario-select" onchange="setMapScenario(this.value)">
        <option value="">Tous les lieux</option>
        ${activeScenarios(ofCurrentTravel(state.scenarios))
          .map(
            (s) =>
              `<option value="${s.id}" ${mapFilters.scenarioId === s.id ? 'selected' : ''}>${escapeHtml(s.name)}</option>`,
          )
          .join('')}
      </select>
      <div id="route-notice" class="filter-hint">${ROUTE_HELP}</div>
    </div>
  `;
}

function mapTypeBlock(title, collection, entries) {
  return /* HTML */ `<div class="filter-block">
    <div class="filter-title">${title}</div>
    ${entries.map(([key, type]) => mapTypeOption(collection, key, type)).join('')}
  </div>`;
}

function mapTypeOption(collection, key, type) {
  return /* HTML */ `<label class="filter-option"
    ><input
      type="checkbox"
      ${mapFilters[collection].has(key) ? 'checked' : ''}
      onchange="toggleMapType('${collection}', '${key}')"
    /><span class="legend-dot" style="background:${type.color};"></span>${type.label}</label
  >`;
}

function mapCountyOption(county) {
  const checked = mapFilters.counties.has(county) || mapFilters.counties.size === 0;
  return /* HTML */ `<label class="filter-option"
    ><input
      type="checkbox"
      ${checked ? 'checked' : ''}
      onchange="toggleMapCounty('${escapeHtml(county)}')"
    />${escapeHtml(county)}</label
  >`;
}
