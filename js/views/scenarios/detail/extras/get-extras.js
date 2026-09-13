/*
  Les lignes d'une étape — ses activités et ses dépenses. Elles vivent toutes sur l'étape : celles
  qui portent un `optionId` appartiennent à cette option, les autres à l'étape elle-même. Une ligne
  s'adresse par son identifiant et jamais par son rang, puisque chaque porteur n'affiche que les
  siennes.
*/
function stepExtras(step) {
  if (!Array.isArray(step.extras)) step.extras = [];
  return step.extras;
}

function holderExtras(step, optionId) {
  return stepExtras(step).filter((line) => (line.optionId || '') === (optionId || ''));
}

function findStepExtra(scenarioId, stepId, lineId) {
  return stepExtras(getStep(scenarioId, stepId)).find((line) => line.id === lineId);
}

// Une ligne référence une activité ou une dépense, jamais les deux.
function extraAttraction(line) {
  return line.attractionId ? getAttraction(line.attractionId) : null;
}

function extraCost(line) {
  return line.costId ? getFixedCost(line.costId) : null;
}
