/*
  Une étape masquée est une variante mise de côté, l'étape d'un groupe masqué et celle d'une colonne
  non retenue en sont d'autres : aucune ne compte dans les dates, les nuits, les totaux ou la carte.
  Seule la liste du détail les montre, en pointillés. Partout ailleurs un `idx` d'étape est un rang
  dans les étapes visibles, pas dans `scenario.steps`.
*/
function isStepVisible(scenario, step) {
  if (step.hidden || isGroupHidden(scenario, step.groupId)) return false;
  return isStepRetained(scenario, step);
}

function visibleSteps(scenario) {
  return scenario.steps.filter((st) => isStepVisible(scenario, st));
}
