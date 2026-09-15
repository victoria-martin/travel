// Le détail de la famille Charges : la voiture, les dépenses rattachées au scénario, puis les
// lignes de dépense posées sur ses étapes et ses groupes.
function chargeDetailRows(scenario) {
  const span = scenarioSpan(scenario);
  return (
    recapSubRow('Voiture', formatEuros(carTotal(scenario))) +
    getScenarioExpenses(scenario)
      .map((cost) => expenseDetailRow(cost, span))
      .join('') +
    scenarioExtraCostLines(scenario).map(extraRecapRow).join('')
  );
}

function expenseDetailRow(cost, span) {
  return recapSubRow(
    tagLabel(EXPENSE_EMOJI, escapeHtml(costLabel(cost))),
    formatEuros(expenseAmount(cost, span)),
  );
}
