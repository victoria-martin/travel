/*
  Un scénario archivé sort de la liste sans disparaître : c'est un état du plan, donc il se garde
  sur le scénario. Les voir est un geste en cours, comme comparer — d'où une globale de module.
*/
let showArchivedScenarios = false;

function toggleArchivedScenarios() {
  showArchivedScenarios = !showArchivedScenarios;
  render();
}

function archivedScenarios(items) {
  return items.filter((s) => !!s.archived === showArchivedScenarios);
}

function activeScenarios(items) {
  return items.filter((s) => !s.archived);
}

function toggleScenarioArchived(id) {
  const s = getScenario(id);
  s.archived = !s.archived;
  if (s.archived) s.isChosen = false;
  saveNow();
  render();
}

function archiveButton(s) {
  return /* HTML */ `<button
    class="icon-btn"
    onclick="toggleScenarioArchived('${s.id}')"
    title="${s.archived ? 'Désarchiver' : 'Archiver'}"
  >
    ${s.archived ? svgIcon('archive-restore') : svgIcon('archive')}
  </button>`;
}
