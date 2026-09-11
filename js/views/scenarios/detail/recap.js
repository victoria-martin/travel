function nightsByPlace(scenario) {
  const rows = new Map();
  scenario.steps.forEach((st) => {
    const nights = parseInt(st.nights) || 0;
    if (nights === 0) return;
    const key = st.cityId
      ? `ville:${st.cityId}`
      : st.accommodationId
        ? `heb:${st.accommodationId}`
        : '';
    rows.set(key, (rows.get(key) || 0) + nights);
  });
  return Array.from(rows, ([key, nights]) => {
    const [kind, id] = key.split(':');
    return {
      city: kind === 'ville' ? getCity(id) : null,
      acc: kind === 'heb' ? getAccommodation(id) : null,
      nights,
    };
  }).sort((a, b) => b.nights - a.nights);
}

function scenarioRecap(scenario) {
  const rows = nightsByPlace(scenario);
  if (rows.length === 0) return '';
  return /* HTML */ `<div class="acc-recap">
    <div class="acc-recap-title">Hébergements</div>
    ${rows.map((r) => scenarioRecapRow(r)).join('')} ${scenarioRecapTotals(scenario)}
  </div>`;
}

function scenarioRecapTotals(scenario) {
  const { euros, guestPoints } = accommodationTotals(scenario);
  return [
    euros.amount || !guestPoints.amount
      ? scenarioRecapTotalRow('Total hébergements', euros.nights, formatEuros(euros.amount))
      : '',
    guestPoints.amount
      ? scenarioRecapTotalRow('Total GP', guestPoints.nights, formatGuestPoints(guestPoints.amount))
      : '',
  ].join('');
}

function scenarioRecapTotalRow(label, nights, amount) {
  return /* HTML */ `<div class="acc-recap-row acc-recap-total">
    <span>${label}</span>
    <span class="acc-recap-nights">${nightsLabel(nights)}</span>
    <strong>${amount}</strong>
  </div>`;
}
