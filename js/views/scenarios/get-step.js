function getStep(scenarioId, stepId) {
  return getScenario(scenarioId).steps.find((x) => x.id === stepId);
}
