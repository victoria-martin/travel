function manualExpenses() {
  return sortItems('charges', ofCurrentTravel(state.fixedCosts));
}
