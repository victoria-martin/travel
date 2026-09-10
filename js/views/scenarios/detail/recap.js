function nightsByAccommodation(scenario) {
  const rows = new Map();
  scenario.steps.forEach((st) => {
    const nights = parseInt(st.nights) || 0;
    if (nights === 0) return;
    const key = st.accommodationId || '';
    rows.set(key, (rows.get(key) || 0) + nights);
  });
  return Array.from(rows, ([id, nights]) => ({
    acc: id ? getAccommodation(id) : null,
    nights,
  })).sort((a, b) => b.nights - a.nights);
}

function scenarioRecap(scenario) {
  const rows = nightsByAccommodation(scenario);
  if (rows.length === 0) return '';
  return /* HTML */ `<div class="acc-recap">
    <div class="acc-recap-title">
      Hébergements du scénario — ${nightsLabel(totalNights(scenario))}
    </div>
    ${rows.map((r) => scenarioRecapRow(r)).join('')}
  </div>`;
}
