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
    if (!rows.has(key)) rows.set(key, { nights: 0, stays: [], steps: [] });
    const row = rows.get(key);
    row.nights += nights;
    row.stays.push(idx);
    row.steps.push(st);
  });
  return Array.from(rows, ([key, { nights, stays, steps }]) => {
    const [kind, id] = key.split(':');
    return {
      city: kind === 'ville' ? getCity(id) : null,
      acc: kind === 'heb' ? getAccommodation(id) : null,
      nights,
      steps,
      dates: stays.map((idx) => stepArrivalDay(scenario, idx)).filter(Boolean),
    };
  }).sort((a, b) => b.nights - a.nights);
}

function scenarioRecap(scenario) {
  const rows = nightsByPlace(scenario);
  if (rows.length === 0) return '';
  const last = scenario.steps.length - 1;
  return /* HTML */ `<div class="acc-recap">
    <div class="acc-recap-title">Hébergements</div>
    ${scenarioRecapStepRow(scenario, 0)} ${rows.map((r) => scenarioRecapRow(r)).join('')}
    ${last > 0 ? scenarioRecapStepRow(scenario, last) : ''} ${scenarioRecapTotals(scenario)}
  </div>`;
}

// Le récap trie les lieux par nuits : les deux bouts du trajet l'encadrent dans leur ordre.
function scenarioRecapStepRow(scenario, idx) {
  const step = scenario.steps[idx];
  return /* HTML */ `<div class="acc-recap-row">
    <span>${escapeHtml(step.city || 'Sans nom')}</span>
    <span class="acc-recap-nights">${stepArrivalDay(scenario, idx)}</span>
    <span></span>
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
