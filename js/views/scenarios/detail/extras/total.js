function extraLinesTotal(lines) {
  return lines.reduce((sum, line) => sum + extraAmount(line), 0);
}

function extrasTotal(step, optionId) {
  return extraLinesTotal(holderExtras(step, optionId));
}

// Les lignes que le scénario compte : celles de l'étape, plus celles de l'option retenue — les
// autres options sont des comparaisons, elles n'entrent dans aucun total.
function scenarioExtraLines(scenario) {
  return visibleSteps(scenario).flatMap((step) => {
    const chosen = chosenOption(step);
    return holderExtras(step, '').concat(chosen.id ? holderExtras(step, chosen.id) : []);
  });
}

// Une ligne se range selon ce qu'elle référence : une dépense grossit les charges, une activité
// compte avec les attractions.
function scenarioAttractionLines(scenario) {
  return scenarioExtraLines(scenario).filter((line) => !line.costId);
}

function scenarioAttractionsTotal(scenario) {
  return extraLinesTotal(scenarioAttractionLines(scenario));
}

function scenarioExtraCostsTotal(scenario) {
  return extraLinesTotal(scenarioExtraLines(scenario).filter((line) => line.costId));
}
