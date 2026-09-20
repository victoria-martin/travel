/*
  Deux lignes seulement : le glyph et le point posés sur les marqueurs (js/views/map/markers.js).
  Les types ne se distinguent plus par couleur sur la carte, donc la légende ne les énumère plus.
*/
function mapLegendPanel() {
  return /* HTML */ `<div class="map-side-panel">
    <div class="map-side-title">Légende</div>
    <div class="map-legend-row">
      <span class="map-type-pin"><span>${svgIcon('house')}</span></span>
      Hébergement
    </div>
    <div class="map-legend-row">
      <span class="map-dot-pin"><span></span></span>
      Lieu &amp; activité
    </div>
  </div>`;
}
