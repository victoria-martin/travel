/*
  Ce qui ne se règle que sur une page reste écrit dans son domaine ; la table dit seulement quelle
  vue en porte et sous quel nom, les réglages communs venant d'abord.
*/
const PAGE_SETTINGS = [
  { view: 'scenario-detail', title: 'Détail du scénario', options: () => trailOptions() },
  { view: 'phrases', title: 'Phrases', options: () => phraseStyleOption() },
];

function pageSettingsBlock() {
  const entry = PAGE_SETTINGS.find((s) => s.view === view);
  if (!entry) return '';
  return /* HTML */ `<div class="filter-block">
    <p class="filter-title">${entry.title}</p>
    ${entry.options()}
  </div>`;
}
