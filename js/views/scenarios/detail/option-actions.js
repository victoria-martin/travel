/*
  Les écritures portent sur une option, jamais sur l'étape : changer les nuits de l'option
  sélectionnée décale les dates de toutes les étapes qui suivent.
*/
function stepOption(scenarioId, stepId, optionId) {
  return getStepOption(getStep(scenarioId, stepId), optionId);
}

function setStepNights(scenarioId, stepId, optionId, nights) {
  stepOption(scenarioId, stepId, optionId).nights = parseInt(nights) || 0;
  saveNow();
  render();
}

function setStepBudget(scenarioId, stepId, optionId, budget) {
  stepOption(scenarioId, stepId, optionId).budget = budget.trim();
  saveNow();
  render();
}

// Une option se rattache soit à une ville, soit à un hébergement : le même select porte les deux.
function setStepPlace(scenarioId, stepId, optionId, value) {
  const option = stepOption(scenarioId, stepId, optionId);
  const [kind, placeId] = value.split(':');
  option.cityId = kind === 'ville' ? placeId : null;
  option.accommodationId = kind === 'heb' ? placeId : null;
  saveNow();
  render();
}

/*
  Le type restreint la liste des lieux aux hébergements qui en relèvent : un lieu qui n'y figure
  plus s'efface, sinon la pastille montrerait un lieu absent de sa propre liste.
*/
function setStepAccommodationType(scenarioId, stepId, optionId, type) {
  const option = stepOption(scenarioId, stepId, optionId);
  option.accommodationType = type;
  const acc = getAccommodation(option.accommodationId);
  if (type && (!acc || accTypeKey(acc.type) !== type)) {
    option.cityId = null;
    option.accommodationId = null;
  }
  saveNow();
  render();
}

function setStepOptionName(scenarioId, stepId, optionId, name) {
  stepOption(scenarioId, stepId, optionId).name = name.trim();
  saveNow();
}

// Une seule option sélectionnée par étape : la choisir démarque les autres, la re-cliquer n'en
// laisse aucune — l'étape ne compte alors ni nuit, ni lieu, ni coût.
function chooseStepOption(scenarioId, stepId, optionId) {
  const step = getStep(scenarioId, stepId);
  const wasSelected = !!getStepOption(step, optionId).isSelected;
  stepOptions(step).forEach((o) => (o.isSelected = !wasSelected && o.id === optionId));
  saveNow();
  render();
}

// Une option neuve reprend le lieu et les nuits de celle qu'on compare : on n'en change qu'un bout.
function addStepOption(scenarioId, stepId) {
  const step = getStep(scenarioId, stepId);
  const options = stepOptions(step);
  step.options = [...options, { ...chosenOption(step), id: uid(), name: '', isSelected: false }];
  saveNow();
  render();
}

// La dernière option ne se retire pas : une étape sans option n'a plus ni lieu ni nuits.
function removeStepOption(scenarioId, stepId, optionId) {
  openInlineMenu = null;
  const step = getStep(scenarioId, stepId);
  if (stepOptions(step).length < 2) return;
  step.options = stepOptions(step).filter((o) => o.id !== optionId);
  if (!stepOptions(step).some((o) => o.isSelected)) stepOptions(step)[0].isSelected = true;
  saveNow();
  render();
}
