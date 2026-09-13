function renderExpensesView() {
  return /* HTML */ `
    ${expensesHeader()}
    <section class="expense-section">
      <h3 class="expense-section-title">Calculé</h3>
      ${derivedExpensesList()}
    </section>
    <section class="expense-section">
      <h3 class="expense-section-title">Saisi</h3>
      ${manualExpensesList(manualExpenses())}
    </section>
    ${expensesTotalBlock()}
  `;
}
