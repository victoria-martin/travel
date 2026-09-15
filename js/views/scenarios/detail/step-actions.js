/*
  Les écritures d'une étape : son type d'hébergement, son lieu, ses nuits, son budget. Changer les
  nuits d'une étape retenue décale les dates de toutes celles qui suivent.
*/
function setStepNights(scenarioId, stepId, nights) {
  getStep(scenarioId, stepId).nights = parseInt(nights) || 0;
  saveNow();
  render();
}

function setStepBudget(scenarioId, stepId, budget) {
  getStep(scenarioId, stepId).budget = budget.trim();
  saveNow();
  render();
}

// Une étape se rattache soit à un lieu, soit à un hébergement : le même select porte les deux.
function setStepPlace(scenarioId, stepId, value) {
  const step = getStep(scenarioId, stepId);
  const [kind, placeId] = value.split(':');
  step.attractionId = kind === 'lieu' ? placeId : null;
  step.accommodationId = kind === 'heb' ? placeId : null;
  saveNow();
  render();
}

/*
  Le type ne restreint que les hébergements : celui qui n'en relève plus s'efface, sinon la
  pastille montrerait un lieu absent de sa propre liste. Un lieu, lui, reste — la liste le
  propose quel que soit le type.
*/
function setStepAccommodationType(scenarioId, stepId, type) {
  const step = getStep(scenarioId, stepId);
  step.accommodationType = type;
  const acc = getAccommodation(step.accommodationId);
  if (type && (!acc || accTypeKey(acc.type) !== type)) step.accommodationId = null;
  saveNow();
  render();
}
