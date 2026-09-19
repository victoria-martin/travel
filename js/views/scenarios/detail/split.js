/*
  Le partage entre la liste d'étapes et le panneau se glisse. Chaque onglet garde sa largeur — la
  carte s'ouvre large, l'argent étroit — donc la préférence en tient une par onglet. Le glisser
  écrit la grille sur l'élément plutôt que de rendre la vue : un rendu par pixel remonterait la
  carte Leaflet à chaque mouvement.
*/
const SPLIT_MIN_PX = 280;
const SPLIT_HANDLE_PX = 6;
// Le rail des onglets est un quatrième invité de la grille, toujours là — même panneau fermé.
const SCENARIO_RAIL_PX = 64;

function scenarioSplitStyle() {
  if (!prefs.scenarioSidePanel) return `grid-template-columns: minmax(0, 1fr) ${SCENARIO_RAIL_PX}px`;
  const pct = prefs.scenarioSideWidth[prefs.scenarioSidePanel] ?? 50;
  return `grid-template-columns: minmax(0, 1fr) ${SPLIT_HANDLE_PX}px ${pct}% ${SCENARIO_RAIL_PX}px`;
}

function scenarioSplitHandle() {
  return /* HTML */ `<div
    class="scenario-split"
    role="separator"
    aria-orientation="vertical"
    onpointerdown="startScenarioSplit(event)"
  ></div>`;
}

function startScenarioSplit(event) {
  const cols = event.currentTarget.closest('.scenario-detail-cols');
  event.currentTarget.setPointerCapture(event.pointerId);
  event.preventDefault();
  const box = cols.getBoundingClientRect();
  const maxPct = ((box.width - SPLIT_MIN_PX) / box.width) * 100;
  const minPct = (SPLIT_MIN_PX / box.width) * 100;
  const onMove = (move) => {
    const pct = ((box.right - SCENARIO_RAIL_PX - move.clientX) / box.width) * 100;
    prefs.scenarioSideWidth[prefs.scenarioSidePanel] = Math.min(Math.max(pct, minPct), maxPct);
    cols.setAttribute('style', scenarioSplitStyle());
    scenarioDetailMaps.forEach((map) => map.invalidateSize());
  };
  const onUp = () => {
    document.removeEventListener('pointermove', onMove);
    persistPrefs();
  };
  document.addEventListener('pointermove', onMove);
  document.addEventListener('pointerup', onUp, { once: true });
}
