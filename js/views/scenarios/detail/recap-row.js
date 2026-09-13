function scenarioRecapRow(r) {
  const cost = placeCost(r);
  return /* HTML */ `<div class="acc-recap-row acc-recap-sub">
    <span>${recapPlaceLabel(r)}</span>
    <span class="acc-recap-nights"
      >${r.dates.length ? `${r.dates.join(', ')} · ` : ''}${nightsLabel(r.nights)}</span
    >
    <strong>${formatCosts(cost)}</strong>
  </div>`;
}

function recapPlaceLabel(r) {
  if (r.city) return `📍 ${escapeHtml(r.city.name)}`;
  if (r.acc)
    return `${accType(r.acc.type).emoji} ${escapeHtml(r.acc.name)} <span class="acc-recap-city">· ${escapeHtml(r.acc.city)}</span>`;
  return '<span class="acc-recap-city">Sans lieu</span>';
}
