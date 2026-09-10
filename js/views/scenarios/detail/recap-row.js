function scenarioRecapRow(r) {
  return /* HTML */ `<div class="acc-recap-row">
    <span>${recapPlaceLabel(r)}</span>
    <strong>${nightsLabel(r.nights)}</strong>
  </div>`;
}

function recapPlaceLabel(r) {
  if (r.city) return `📍 ${escapeHtml(r.city.name)}`;
  if (r.acc)
    return `${accType(r.acc.type).emoji} ${escapeHtml(r.acc.name)} <span class="acc-recap-city">· ${escapeHtml(r.acc.city)}</span>`;
  return '<span class="acc-recap-city">Sans lieu</span>';
}
