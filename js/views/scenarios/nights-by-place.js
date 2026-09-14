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
