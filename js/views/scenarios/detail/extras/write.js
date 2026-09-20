function emptyExtra() {
  return { id: uid(), attractionId: '', costId: '', date: '', count: 1, budget: '' };
}

// La recherche reste ouverte après un ajout : on rattache souvent plusieurs lignes d'affilée.
function pushExtra(scenarioId, holderId, reference) {
  holderExtras(getExtraHolder(scenarioId, holderId)).push({ ...emptyExtra(), ...reference });
  saveNow();
  render();
  focusExtraSearch(holderId);
}

function attachExtraAttraction(scenarioId, holderId, attractionId) {
  pushExtra(scenarioId, holderId, { attractionId });
}

function attachExtraCost(scenarioId, holderId, costId) {
  pushExtra(scenarioId, holderId, { costId });
}

function setExtraAttraction(scenarioId, holderId, lineId, attractionId) {
  findHolderExtra(scenarioId, holderId, lineId).attractionId = attractionId;
  saveNow();
  render();
}

function setExtraCost(scenarioId, holderId, lineId, costId) {
  findHolderExtra(scenarioId, holderId, lineId).costId = costId;
  saveNow();
  render();
}

function detachExtra(scenarioId, holderId, lineId) {
  openInlineMenu = null;
  const holder = getExtraHolder(scenarioId, holderId);
  holder.extras = holderExtras(holder).filter((line) => line.id !== lineId);
  saveNow();
  render();
}

function setExtraCount(scenarioId, holderId, lineId, count) {
  findHolderExtra(scenarioId, holderId, lineId).count = parseInt(count) || 1;
  saveNow();
  render();
}

function setExtraBudget(scenarioId, holderId, lineId, budget) {
  findHolderExtra(scenarioId, holderId, lineId).budget = budget.trim();
  saveNow();
  render();
}

function setExtraDate(scenarioId, holderId, lineId, date) {
  findHolderExtra(scenarioId, holderId, lineId).date = date;
  saveNow();
  render();
}
