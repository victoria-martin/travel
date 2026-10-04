function attachScenarioExpense(scenarioId, costId) {
  getScenario(scenarioId).costIds.push(costId);
  saveNow();
  render();
}

// Retirer une dépense du scénario ne la supprime pas : elle reste sur la page Dépenses.
function detachScenarioExpense(scenarioId, costId) {
  const scenario = getScenario(scenarioId);
  scenario.costIds = scenario.costIds.filter((id) => id !== costId);
  saveNow();
  render();
}
