let leafletMap = null;

function renderMapView() {
  return /* HTML */ `
    <div class="view-header">
      <div>
        <h2 class="view-title">Carte</h2>
        <p class="view-sub">Filtre par type, région ou scénario</p>
      </div>
    </div>
    <div class="map-layout">
      <div class="map-filters">${mapFilterPanel()}</div>
      <div id="map"></div>
    </div>
  `;
}
