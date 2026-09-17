/*
  Le détail de la famille Route : les kilomètres du tracé, puis ce qu'ils brûlent et ce qu'ils
  coûtent en péage. Chaque ligne redit le taux dont vient son montant — c'est ce qui rend une
  estimation relisable, et les deux taux se changent dans la fiche du voyage.
*/
function roadDetailRows(scenario) {
  const km = scenarioRoadKm(scenario);
  if (km === null) return roadRow('Distance', 'le tracé arrive…', '—');
  return (
    roadRow('Distance', '', distanceLabel(km * 1000)) +
    roadFuelRow(scenario) +
    roadRow(
      'Péages',
      `${formatRate(travelTollRate())} €/km`,
      formatEuros(scenarioTollCost(scenario)),
    )
  );
}

function roadFuelRow(scenario) {
  const consumption = scenarioFuelConsumption(scenario);
  if (!consumption) return roadRow('Essence', 'consommation du modèle non renseignée', '—');
  return roadRow(
    'Essence',
    `${formatRate(consumption)} L/100 · ${formatRate(travelFuelPrice())} €/L`,
    formatEuros(scenarioFuelCost(scenario)),
  );
}

function roadRow(label, note, amount) {
  return /* HTML */ `<div class="acc-recap-row acc-recap-sub">
    <span>${recapIconLabel('', label)}</span>
    <span class="acc-recap-nights">${escapeHtml(note)}</span>
    <strong>${amount}</strong>
  </div>`;
}
