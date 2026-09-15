// Le détail de la famille Charges : la voiture, les dépenses rattachées au scénario, puis les
// lignes de dépense posées sur ses étapes et ses groupes.
function chargeDetailRows(scenario) {
  const span = scenarioSpan(scenario);
  return (
    recapSubRow('Voiture', formatEuros(scenarioOfferTotal(scenario))) +
    getScenarioExpenses(scenario)
      .map((cost) => expenseDetailRow(cost, span))
      .join('') +
    scenarioExtraCostLines(scenario).map(extraRecapRow).join('')
  );
}

// Le montant unitaire et sa récurrence se relisent sur la ligne : c'est d'eux que vient le total.
function expenseDetailRow(cost, span) {
  const unit = expenseRecurrence(cost.recurrence).unit;
  return /* HTML */ `<div class="acc-recap-row acc-recap-sub acc-recap-expense">
    <span
      >${tagLabel(EXPENSE_ICON, escapeHtml(costLabel(cost)))}
      ${unit ? `<span class="expense-unit">${escapeHtml(expenseAmountLabel(cost))}</span>` : ''}</span
    >
    <span></span>
    <strong>${formatEuros(expenseAmount(cost, span))}</strong>
  </div>`;
}
