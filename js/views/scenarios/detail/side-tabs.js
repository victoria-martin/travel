// En dessous de 640px, la grille du détail n'a plus de colonne de droite (elle repasse à une
// seule colonne) : le même bouton ouvre alors le panneau en sheet plutôt que de le pousser sous
// les étapes.
function onScenarioPanelToggle(scenarioId, key) {
  if (window.matchMedia('(max-width: 639px)').matches) openSheet('scenario-panel', scenarioId, key);
  else toggleScenarioSidePanel(key);
}

function toggleScenarioSidePanel(key) {
  prefs.scenarioSidePanel = prefs.scenarioSidePanel === key ? null : key;
  persistPrefs();
  renderWithTransition();
}
