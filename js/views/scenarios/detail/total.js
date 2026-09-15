function scenarioTotalBlock(scenario) {
  const acc = accommodationTotals(scenario);
  return /* HTML */ `<div class="acc-recap">
    <div class="acc-recap-title">Total général</div>
    ${recapGroup(
      'accommodations',
      'Hébergements',
      formatEuros(acc.euros.amount),
      accommodationDetailRows(scenario),
    )}
    ${
      acc.guestPoints.amount
        ? recapRow('Hébergements en GP', formatGuestPoints(acc.guestPoints.amount))
        : ''
    }
    ${recapGroup(
      'charges',
      'Charges',
      formatEuros(scenarioChargesTotal(scenario)),
      chargeDetailRows(scenario),
    )}
    ${recapGroup(
      'attractions',
      'Attractions',
      formatEuros(scenarioAttractionsTotal(scenario)),
      attractionDetailRows(scenario),
    )}
    <div class="acc-recap-row acc-recap-total">
      <span>Total</span>
      <span class="acc-recap-nights">${nightsLabel(totalNights(scenario))}</span>
      <strong>${formatCosts(scenarioTotal(scenario))}</strong>
    </div>
  </div>`;
}

// Une famille porte son détail et se replie pour elle-même. Son montant se lit sur son titre, que
// le groupe soit ouvert ou non, et la ligne qui ferme le détail le redit au pied.
function recapGroup(key, title, total, rows) {
  return /* HTML */ `<details
    class="acc-recap-fold"
    ${recapFoldOpen(key) ? 'open' : ''}
    ontoggle="setRecapFold('${key}', this.open)"
  >
    <summary class="acc-recap-row">
      <span>${title}</span>
      <span></span>
      <strong>${total}</strong>
    </summary>
    ${rows} ${recapRow('Total', total, 'acc-recap-sub acc-recap-subtotal')}
  </details>`;
}

function recapFoldOpen(key) {
  return prefs.recapFolds[key] !== false;
}

function setRecapFold(key, open) {
  prefs.recapFolds[key] = open;
  persistPrefs();
}
