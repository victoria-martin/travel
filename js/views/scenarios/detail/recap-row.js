// Les lignes du récap : une famille au premier niveau, son détail en retrait, et la ligne qui la
// ferme sur son total.
function recapRow(label, amount, className) {
  return /* HTML */ `<div class="acc-recap-row${className ? ` ${className}` : ''}">
    <span>${label}</span>
    <span></span>
    <strong>${amount}</strong>
  </div>`;
}

function recapSubRow(label, amount) {
  return recapRow(label, amount, 'acc-recap-sub');
}

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
