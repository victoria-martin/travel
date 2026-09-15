function extraLinesTotal(lines) {
  return lines.reduce((sum, line) => sum + extraAmount(line), 0);
}

function extrasTotal(holder) {
  return extraLinesTotal(holderExtras(holder));
}

// Les lignes que le scénario compte : celles de ses étapes retenues, plus celles des groupes qu'il
// traverse — les colonnes écartées sont des comparaisons, elles n'entrent dans aucun total.
function scenarioExtraLines(scenario) {
  const groupIds = new Set(
    visibleSteps(scenario)
      .map((step) => step.groupId)
      .filter(Boolean),
  );
  return visibleSteps(scenario)
    .flatMap(holderExtras)
    .concat(
      scenarioGroups(scenario)
        .filter((g) => groupIds.has(g.id))
        .flatMap(holderExtras),
    );
}

// Une ligne se range selon ce qu'elle référence : une dépense grossit les charges, une activité
// compte avec les attractions.
function scenarioAttractionLines(scenario) {
  return scenarioExtraLines(scenario).filter((line) => !line.costId);
}

function scenarioAttractionsTotal(scenario) {
  return extraLinesTotal(scenarioAttractionLines(scenario));
}

function scenarioExtraCostLines(scenario) {
  return scenarioExtraLines(scenario).filter((line) => line.costId);
}

function scenarioExtraCostsTotal(scenario) {
  return extraLinesTotal(scenarioExtraCostLines(scenario));
}
