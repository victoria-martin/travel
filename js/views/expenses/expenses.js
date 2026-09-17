function renderExpensesView() {
  return /* HTML */ `
    ${expensesHeader()}
    <section class="list-section">
      <h3 class="list-section-title">Calculé</h3>
      ${derivedExpensesList()}
    </section>
    <section class="list-section">
      <h3 class="list-section-title">Saisi</h3>
      ${manualExpensesList(manualExpenses())}
    </section>
    ${expensesTotalBlock()}
  `;
}
