// Le récap d'un scénario, lu d'un coup d'œil contre celui d'à côté : le détail des hébergements,
// puis une ligne par famille. Les charges et les attractions ne montrent que leur total — le détail
// se lit dans le scénario.
function scenarioCompareCard(s) {
  const acc = accommodationTotals(s);
  return /* HTML */ `<div class="acc-recap scenario-compare-card">
    <div class="scenario-compare-name">${escapeHtml(s.name)}</div>
    <div class="acc-recap-title">Hébergements</div>
    ${accommodationDetailRows(s)} ${recapRow('Total hébergements', formatEuros(acc.euros.amount))}
    ${
      acc.guestPoints.amount
        ? recapRow('Hébergements en GP', formatGuestPoints(acc.guestPoints.amount))
        : ''
    }
    ${recapRow('Charges', formatEuros(scenarioChargesTotal(s)))}
    ${recapRow('Transport', formatEuros(scenarioTransportTotal(s)))}
    ${recapRow('Attractions', formatEuros(scenarioAttractionsTotal(s)))}
    <div class="acc-recap-row acc-recap-total">
      <span>Total</span>
      <span class="acc-recap-nights">${nightsLabel(totalNights(s))}</span>
      <strong>${formatCosts(scenarioTotal(s))}</strong>
    </div>
  </div>`;
}
