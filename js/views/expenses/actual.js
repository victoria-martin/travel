function expenseBudgetScenario() {
  return ofCurrentTravel(state.scenarios).find((scenario) => scenario.isChosen) || null;
}

function actualExpenses() {
  return ofCurrentTravel(state.actualExpenses).sort(
    (expenseA, expenseB) =>
      (expenseA.date || '').localeCompare(expenseB.date || '') ||
      (expenseA.label || '').localeCompare(expenseB.label || ''),
  );
}

function getActualExpense(id) {
  return state.actualExpenses.find((expense) => expense.id === id);
}

function emptyActualExpense() {
  return {
    id: null,
    date: dateToIso(new Date()),
    label: '',
    amount: '',
    fixedCostId: '',
    category: '',
    subCategory: '',
    address: '',
    notes: '',
  };
}

function actualExpensesTotal() {
  return actualExpenses().reduce((sum, expense) => sum + priceNumber(expense.amount), 0);
}

function scenarioBudgetTotal(scenario) {
  if (!scenario) return 0;
  const span = scenarioSpan(scenario);
  return getScenarioExpenses(scenario).reduce((sum, cost) => sum + expenseAmount(cost, span), 0);
}

function actualExpenseCostTotal(costId) {
  return actualExpenses()
    .filter((expense) => expense.fixedCostId === costId)
    .reduce((sum, expense) => sum + priceNumber(expense.amount), 0);
}

function actualExpensesWithoutBudget() {
  const costIds = new Set(manualExpenses().map((cost) => cost.id));
  return actualExpenses().filter((expense) => !costIds.has(expense.fixedCostId));
}

// Formulaire : src/domains/expenses/modal/ActualExpenseModal.tsx (premier type de modale porté en
// React, docs/archivé/react-migration-plan.md § 4) — cette fonction ne reste que pour la sauvegarde, lue
// par les mêmes ids de champs, peints maintenant par ce composant plutôt que par du HTML en chaîne.
function saveActualExpense(id) {
  const dateField = document.getElementById('actual-expense-date');
  const labelField = document.getElementById('actual-expense-label');
  const amountField = document.getElementById('actual-expense-amount');
  if (
    !dateField.reportValidity() ||
    !labelField.reportValidity() ||
    !amountField.reportValidity()
  ) {
    return;
  }

  const expense = {
    id: id || uid(),
    travelId: currentTravelId(),
    date: dateField.value,
    label: labelField.value.trim(),
    amount: amountField.value.trim(),
    fixedCostId: document.getElementById('actual-expense-budget').value,
    category: document.getElementById('actual-expense-category').value.trim(),
    subCategory: document.getElementById('actual-expense-sub-category').value.trim(),
    address: document.getElementById('actual-expense-address').value.trim(),
    notes: document.getElementById('actual-expense-notes').value.trim(),
    createdAt: id ? getActualExpense(id).createdAt : new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const index = state.actualExpenses.findIndex((item) => item.id === id);
  if (id) state.actualExpenses[index] = expense;
  else state.actualExpenses.push(expense);
  saveNow();
  closeModal();
}
