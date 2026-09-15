function manualExpenses() {
  return sortItems('charges', ofCurrentTravel(state.fixedCosts));
}

// Une dépense qui se multiplie n'a pas de compte hors d'un scénario : comme une source dérivée à
// montant ouvert, elle reste hors du total tant que rien ne dit sur combien la compter.
function manualExpensesTotal() {
  return manualExpenses()
    .filter((c) => !expenseRecurrence(c.recurrence).unit)
    .reduce((sum, c) => sum + priceNumber(c.amount), 0);
}

function manualExpensesList(items) {
  if (items.length === 0) {
    return emptyState('Aucune dépense saisie', 'Ajoute un cadeau, des courses, une bouteille.');
  }
  return listViewMode.charges === 'table' ? listTable('charges', items) : fixedCostCards(items);
}
