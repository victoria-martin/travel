/*
  La colonne de gauche se glisse comme le panneau du détail d'un scénario
  ([scenarios/detail/split.js](../scenarios/detail/split.js)) : la largeur est écrite sur l'élément
  pendant le geste plutôt que rendue à chaque pixel, sans quoi Leaflet serait redessiné en boucle.
*/
const MAP_SPLIT_MIN_PX = 180;
const MAP_SPLIT_MAX_PX = 480;

function mapSplitHandle() {
  return /* HTML */ `<div
    class="map-split"
    role="separator"
    aria-orientation="vertical"
    onpointerdown="startMapSplit(event)"
  ></div>`;
}

function startMapSplit(event) {
  const layout = event.currentTarget.closest('.map-layout');
  const side = layout.querySelector('.map-side');
  event.currentTarget.setPointerCapture(event.pointerId);
  event.preventDefault();
  const box = layout.getBoundingClientRect();
  const onMove = (move) => {
    const width = Math.min(
      Math.max(move.clientX - box.left, MAP_SPLIT_MIN_PX),
      MAP_SPLIT_MAX_PX,
    );
    prefs.mapSideWidth = width;
    side.style.width = `${width}px`;
    if (leafletMap) leafletMap.invalidateSize();
  };
  const onUp = () => {
    document.removeEventListener('pointermove', onMove);
    persistPrefs();
  };
  document.addEventListener('pointermove', onMove);
  document.addEventListener('pointerup', onUp, { once: true });
}
