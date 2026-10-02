function renderExpensesView() {
  const scenario = expenseBudgetScenario();
  return /* HTML */ `
    ${expensesHeader(scenario)} ${expensesTotalBlock(scenario)}
    <section class="list-section">
      <div class="list-section-head">
        <div>
          <h3 class="list-section-title">Budget prévu</h3>
          <div class="expenses-section-subtitle">
            ${scenario ? escapeHtml(scenario.name) : 'Aucun scénario retenu'}
          </div>
        </div>
      </div>
      ${expensesBudgetList(scenario)}
    </section>
    <section class="list-section">
      <div class="list-section-head">
        <div>
          <h3 class="list-section-title">Dépenses réelles</h3>
          <div class="expenses-section-subtitle">${actualExpenses().length} entrées · par date</div>
        </div>
      </div>
      ${actualExpensesList()}
    </section>
    <details class="list-section expenses-calculated">
      <summary>
        <span class="list-section-title">Calculé depuis les réservations</span>
        <strong>${formatEuros(derivedExpensesTotal())}</strong>
      </summary>
      ${derivedExpensesList()}
    </details>
  `;
}
