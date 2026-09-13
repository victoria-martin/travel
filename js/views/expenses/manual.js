function manualExpenses() {
  return sortItems('charges', ofCurrentTravel(state.fixedCosts));
}

function manualExpensesTotal() {
  return manualExpenses().reduce((sum, c) => sum + priceNumber(c.amount), 0);
}

function manualExpensesList(items) {
  if (items.length === 0) {
    return emptyState('Aucune dépense saisie', 'Ajoute un cadeau, des courses, une bouteille.');
  }
  return listViewMode.charges === 'table' ? listTable('charges', items) : fixedCostCards(items);
}
