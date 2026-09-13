function extrasTotal(step, optionId) {
  return holderExtras(step, optionId).reduce((sum, line) => sum + extraAmount(line), 0);
}

// Une étape compte ses propres lignes plus celles de l'option retenue : les autres options sont
// des comparaisons, elles n'entrent dans aucun total.
function stepExtrasTotal(step) {
  const chosen = chosenOption(step);
  return extrasTotal(step, '') + (chosen.id ? extrasTotal(step, chosen.id) : 0);
}

function scenarioExtrasTotal(scenario) {
  return visibleSteps(scenario).reduce((sum, step) => sum + stepExtrasTotal(step), 0);
}
