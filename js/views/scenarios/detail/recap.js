// Un lieu revisité tient sur une ligne : ses nuits s'additionnent et ses séjours se listent.
function nightsByPlace(scenario) {
  const rows = new Map();
  scenario.steps.forEach((st, idx) => {
    const nights = parseInt(st.nights) || 0;
    if (nights === 0) return;
    const key = st.cityId
      ? `ville:${st.cityId}`
      : st.accommodationId
        ? `heb:${st.accommodationId}`
        : '';
    if (!rows.has(key)) rows.set(key, { nights: 0, stays: [] });
    const row = rows.get(key);
    row.nights += nights;
    row.stays.push(idx);
  });
  return Array.from(rows, ([key, { nights, stays }]) => {
    const [kind, id] = key.split(':');
    return {
      city: kind === 'ville' ? getCity(id) : null,
      acc: kind === 'heb' ? getAccommodation(id) : null,
      nights,
      dates: stays.map((idx) => stepArrivalDay(scenario, idx)).filter(Boolean),
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
