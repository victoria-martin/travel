let leafletMap = null;

function renderMapView() {
  return /* HTML */ `
    <div class="view-header">
      <div>
        <h2 class="view-title">Carte</h2>
        <p class="view-sub" id="route-notice">${ROUTE_HELP}</p>
      </div>
      <div class="view-header-actions">
        ${mapFilterButton()}
        ${toolbarButton({
          icon: svgIcon('compass'),
          label: 'Itinéraire',
          onclick: 'toggleRouteBuilderMode()',
          active: routeBuilder.active,
        })}
        ${toolbarSeparator()} ${newCityPanel()} ${toolbarSeparator()} ${toolbarMenu()}
      </div>
    </div>
    <div class="map-layout">
      <div class="map-side" style="width:${prefs.mapSideWidth}px">
        ${routeBuilderPanel()} ${mapScenarioPanel()} ${mapFilterPanel()} ${mapLegendPanel()}
      </div>
      ${mapSplitHandle()}
      <div id="map"></div>
    </div>
  `;
}
