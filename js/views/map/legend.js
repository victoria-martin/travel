/*
  La légende reprend le glyph et les couleurs posés sur les marqueurs — même icône par collection
  (js/views/map/markers.js), même table de types que les modales — un groupe par collection tracée.
*/
function mapLegendPanel() {
  return /* HTML */ `<div class="map-side-panel">
    <div class="map-side-title">Légende</div>
    ${mapLegendGroup('Hébergements', 'house', ACCOMMODATION_TYPES)}
    ${mapLegendGroup('Lieux & activités', 'landmark', ATTRACTION_TYPES)}
  </div>`;
}

function mapLegendGroup(label, icon, types) {
  return /* HTML */ `<div class="map-legend-group">
    <div class="map-legend-group-title">${escapeHtml(label)}</div>
    ${Object.values(types)
      .map((type) => mapLegendRow(icon, type))
      .join('')}
  </div>`;
}

function mapLegendRow(icon, type) {
  return /* HTML */ `<div class="map-legend-row">
    <span class="map-type-pin"><span style="background:${type.color}">${svgIcon(icon)}</span></span>
    ${escapeHtml(type.label)}
  </div>`;
}
