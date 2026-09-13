// Un lieu revisité tient sur une ligne : ses nuits s'additionnent et ses séjours se listent.
function nightsByPlace(scenario) {
  const rows = new Map();
  visibleSteps(scenario).forEach((st, idx) => {
    const nights = stepNights(st);
    if (nights === 0) return;
    const option = chosenOption(st);
    const key = option.cityId
      ? `ville:${option.cityId}`
      : option.accommodationId
        ? `heb:${option.accommodationId}`
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
      firstStay: stays[0],
      dates: stays.map((idx) => stepArrivalDay(scenario, idx)).filter(Boolean),
    };
  }).sort((a, b) => a.firstStay - b.firstStay);
}

// Le détail de la ligne Hébergements du total, dans l'ordre du trajet.
function accommodationDetailRows(scenario) {
  const rows = nightsByPlace(scenario);
  if (rows.length === 0) return '';
  const steps = visibleSteps(scenario);
  return rows.map(scenarioRecapRow).join('') + scenarioLastDayRow(scenario, steps.length - 1);
}

// Une dernière étape sans nuit n'entre dans aucun lieu : elle ferme la liste avec sa seule date.
function scenarioLastDayRow(scenario, idx) {
  const step = visibleSteps(scenario)[idx];
  if (!step || stepNights(step) > 0) return '';
  return /* HTML */ `<div class="acc-recap-row acc-recap-sub">
    <span>${escapeHtml(step.city || 'Sans nom')}</span>
    <span class="acc-recap-nights">${stepArrivalDay(scenario, idx)}</span>
    <span></span>
  </div>`;
}
