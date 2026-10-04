/*
  Un scénario archivé sort de la liste sans disparaître : c'est un état du plan, donc il se garde
  sur le scénario. Les voir est un geste en cours, comme comparer — d'où une globale de module.
*/
var showArchivedScenarios = false;

function toggleArchivedScenarios() {
  showArchivedScenarios = !showArchivedScenarios;
  render();
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

