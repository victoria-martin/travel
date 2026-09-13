function scenarioTotalBlock(scenario) {
  const acc = accommodationTotals(scenario);
  return /* HTML */ `<div class="acc-recap">
    <div class="acc-recap-title">Total général</div>
    ${scenarioAccommodationRow(scenario, formatEuros(acc.euros.amount))}
    ${
      acc.guestPoints.amount
        ? scenarioTotalDetailRow('Hébergements en GP', formatGuestPoints(acc.guestPoints.amount))
        : ''
    }
    ${scenarioTotalDetailRow('Voiture', formatEuros(carTotal(scenario)))}
    ${scenarioTotalDetailRow('Charges fixes', formatEuros(fixedCostsTotal(scenario)))}
    <div class="acc-recap-row acc-recap-total">
      <span>Total</span>
      <span class="acc-recap-nights">${nightsLabel(totalNights(scenario))}</span>
      <strong>${formatCosts(scenarioTotal(scenario))}</strong>
    </div>
  </div>`;
}

// La ligne Hébergements déplie le détail par lieu : il n'a plus de bloc à lui.
function scenarioAccommodationRow(scenario, amount) {
  return /* HTML */ `<details
    class="acc-recap-fold"
    ${prefs.showAccommodationDetail ? 'open' : ''}
    ontoggle="setAccommodationDetail(this.open)"
  >
    <summary class="acc-recap-row">
      <span>Hébergements</span>
      <span></span>
      <strong>${amount}</strong>
    </summary>
    ${accommodationDetailRows(scenario)}
  </details>`;
}

function setAccommodationDetail(open) {
  prefs.showAccommodationDetail = open;
  persistPrefs();
}

function scenarioTotalDetailRow(label, amount) {
  return /* HTML */ `<div class="acc-recap-row">
    <span>${label}</span>
    <span></span>
    <strong>${amount}</strong>
  </div>`;
}
