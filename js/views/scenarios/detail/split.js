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

// Sous 1100px le rail est masqué (styles.css) : ne pas lui réserver de colonne — une colonne à
// 0px garderait quand même le gap fixe de la grille, un blanc à sa place.
function scenarioRailHidden() {
  return window.matchMedia('(max-width: 1100px)').matches;
}

function scenarioSplitStyle() {
  const rail = scenarioRailHidden() ? '' : ` ${SCENARIO_RAIL_PX}px`;
  if (!prefs.scenarioSidePanel) return `grid-template-columns: minmax(0, 1fr)${rail}`;
  const pct = prefs.scenarioSideWidth[prefs.scenarioSidePanel] ?? 50;
  return `grid-template-columns: minmax(0, 1fr) ${SPLIT_HANDLE_PX}px ${pct}%${rail}`;
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
    const pct = ((box.right - (scenarioRailHidden() ? 0 : SCENARIO_RAIL_PX) - move.clientX) / box.width) * 100;
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
