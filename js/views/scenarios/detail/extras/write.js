function emptyExtra(optionId) {
  return {
    id: uid(),
    optionId: optionId || '',
    attractionId: '',
    costId: '',
    count: 1,
    budget: '',
  };
}

// La recherche reste ouverte après un ajout : on rattache souvent plusieurs lignes d'affilée.
function pushExtra(scenarioId, stepId, optionId, reference) {
  stepExtras(getStep(scenarioId, stepId)).push({ ...emptyExtra(optionId), ...reference });
  saveNow();
  render();
  focusExtraSearch(extraHolderKey(stepId, optionId));
}

function attachExtraAttraction(scenarioId, stepId, optionId, attractionId) {
  pushExtra(scenarioId, stepId, optionId, { attractionId });
}

function attachExtraCost(scenarioId, stepId, optionId, costId) {
  pushExtra(scenarioId, stepId, optionId, { costId });
}

function setExtraAttraction(scenarioId, stepId, lineId, attractionId) {
  findStepExtra(scenarioId, stepId, lineId).attractionId = attractionId;
  saveNow();
  render();
}

function setExtraCost(scenarioId, stepId, lineId, costId) {
  findStepExtra(scenarioId, stepId, lineId).costId = costId;
  saveNow();
  render();
}

function detachExtra(scenarioId, stepId, lineId) {
  openInlineMenu = null;
  const step = getStep(scenarioId, stepId);
  step.extras = stepExtras(step).filter((line) => line.id !== lineId);
  saveNow();
  render();
}

function setExtraCount(scenarioId, stepId, lineId, count) {
  findStepExtra(scenarioId, stepId, lineId).count = parseInt(count) || 1;
  saveNow();
  render();
}

function setExtraBudget(scenarioId, stepId, lineId, budget) {
  findStepExtra(scenarioId, stepId, lineId).budget = budget.trim();
  saveNow();
  render();
}
