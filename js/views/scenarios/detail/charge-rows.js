// Le détail de la famille Charges : les dépenses rattachées au scénario, puis les lignes de
// dépense posées sur ses étapes et ses groupes. La voiture est dans la famille Transport.
function chargeDetailRows(scenario) {
  const span = scenarioSpan(scenario);
  return (
    getScenarioExpenses(scenario)
      .map((cost) => expenseDetailRow(cost, span))
      .join('') + scenarioExtraCostLines(scenario).map(extraRecapRow).join('')
  );
}

function expenseDetailRow(cost, span) {
  return recapSubRow(escapeHtml(costLabel(cost)), formatEuros(expenseAmount(cost, span)));
}
