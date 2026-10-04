function setScenarioRoadBudget(scenarioId, field, value) {
  getScenario(scenarioId)[field] = value.trim();
  saveNow();
  render();
}
