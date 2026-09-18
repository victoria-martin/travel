let leafletMap = null;

function renderMapView() {
  return /* HTML */ `
    <div class="view-header">
      <div>
        <h2 class="view-title">Carte</h2>
        <p class="view-sub" id="route-notice">${ROUTE_HELP}</p>
      </div>
      <div class="view-header-actions">
        ${mapFilterButton()} ${toolbarSeparator()} ${mapScenarioSelect()} ${toolbarSeparator()}
        ${newCityPanel()} ${toolbarSeparator()} ${toolbarMenu()}
      </div>
    </div>
    <div class="map-layout">
      <div class="map-filters">${mapFilterPanel()}</div>
      <div id="map"></div>
    </div>
  `;
}
