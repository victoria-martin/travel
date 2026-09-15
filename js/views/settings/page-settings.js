/*
  Ce qui ne se règle que sur une page reste écrit dans son domaine ; la table dit seulement quelle
  vue en porte, et le panneau les pose sous les réglages communs.
*/
const PAGE_SETTINGS = [
  { view: 'scenarios', block: () => routePaintOptions() },
  { view: 'scenario-detail', block: () => trailColorOption() },
];

function pageSettingsBlock() {
  const entry = PAGE_SETTINGS.find((s) => s.view === view);
  return entry ? entry.block() : '';
}
