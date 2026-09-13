function expensesTotal() {
  return derivedExpensesTotal() + manualExpensesTotal();
}

function expensesTotalBlock() {
  return /* HTML */ `<div class="acc-recap">
    <div class="acc-recap-row">
      <span>Calculé</span><span></span><strong>${formatEuros(derivedExpensesTotal())}</strong>
    </div>
    <div class="acc-recap-row">
      <span>Saisi</span><span></span><strong>${formatEuros(manualExpensesTotal())}</strong>
    </div>
    <div class="acc-recap-row acc-recap-total">
      <span>Total</span><span></span><strong>${formatEuros(expensesTotal())}</strong>
    </div>
  </div>`;
}
