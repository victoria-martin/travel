function expensesHeader(scenario) {
  const addBudgetAction = scenario
    ? `openModal('charge', '', '${scenario.id}')`
    : "openModal('charge')";
  return /* HTML */ `<div class="view-header">
    <div>
      <h2 class="view-title">Dépenses</h2>
      <p class="view-sub">Budget du scénario et dépenses réelles du voyage</p>
    </div>
    <div class="view-header-actions">
      ${sortPanel('charges')} ${toolbarSeparator()}
      ${toolbarButton({ icon: svgIcon('plus'), label: 'Ajouter au budget', onclick: addBudgetAction, primary: true })}
      ${toolbarButton({ icon: svgIcon('plus'), label: 'Dépense réelle', onclick: "openModal('actual-expense')", primary: true })}
      ${toolbarSeparator()} ${toolbarMenu()}
    </div>
  </div>`;
}
