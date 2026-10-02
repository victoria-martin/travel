function expensesTotalBlock(scenario) {
  const budgetTotal = scenario ? scenarioBudgetTotal(scenario) : null;
  const actualTotal = actualExpensesTotal();
  const remaining = budgetTotal === null ? null : budgetTotal - actualTotal;
  return /* HTML */ `<section class="expenses-summary" aria-label="Budget et dépenses réelles">
    <div class="expenses-metric">
      <span>Budget du scénario</span>
      <strong>${budgetTotal === null ? '—' : formatEuros(budgetTotal)}</strong>
      <small
        >${scenario ? `${getScenarioExpenses(scenario).length} postes budgétés` : 'Aucun scénario retenu'}</small
      >
    </div>
    <div class="expenses-metric">
      <span>Dépenses réelles</span>
      <strong>${formatEuros(actualTotal)}</strong>
      <small>${actualExpenses().length} dépenses datées</small>
    </div>
    <div class="expenses-metric ${remaining !== null && remaining < 0 ? 'expenses-over' : ''}">
      <span>Budget restant</span>
      <strong>${remaining === null ? '—' : formatEuros(remaining)}</strong>
      <small>Budget moins dépenses réelles</small>
    </div>
  </section>`;
}
