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
    <div class="acc-recap-title">Nuits par lieu — ${nightsLabel(totalNights(scenario))}</div>
    ${rows.map((r) => scenarioRecapRow(r)).join('')}
  </div>`;
}
