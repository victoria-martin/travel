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
  if (r.place) return recapIconLabel(attractionType(r.place.type).emoji, escapeHtml(r.place.name));
  if (r.acc)
    return recapIconLabel(
      accType(r.acc.type).emoji,
      `${escapeHtml(r.acc.name)} <span class="acc-recap-city">· ${escapeHtml(r.acc.city)}</span>`,
    );
  return recapIconLabel('', '<span class="acc-recap-city">Sans lieu</span>');
}

// Toutes les lignes du détail s'ouvrent sur la même gouttière : les noms s'alignent, qu'une ligne
// porte une icône ou non, et le chiffre d'une ligne de route tombe sur eux.
function recapIconLabel(icon, label) {
  return `<span class="acc-recap-icon">${icon}</span>${label}`;
}

// Une ligne d'extra se lit pareil dans les deux familles : son libellé, son nombre s'il dépasse un,
// son montant.
function extraRecapRow(line) {
  const count = extraCount(line);
  return /* HTML */ `<div class="acc-recap-row acc-recap-sub">
    <span>${extraLabel(line)}</span>
    <span class="acc-recap-nights"
      >${extraDateLabel(line)}${extraDateLabel(line) && count > 1 ? ' · ' : ''}${count > 1 ? extraCountLabel(count) : ''}</span
    >
    <strong>${formatEuros(extraAmount(line))}</strong>
  </div>`;
}

function extraDateLabel(line) {
  return line.date ? scenarioDateLabel(line.date) : '';
}

// Entre deux lieux, la route qu'on conduit de l'un à l'autre : sa propre ligne, sans montant, donc
// hors de la rangée à trois colonnes. Le chiffre vient d'OSRM après le rendu, comme dans la
// gouttière.
function recapLegRow(scenario, step) {
  const slot = stepLegRecapSlot(scenario, step);
  return slot ? `<div class="acc-recap-leg">${recapIconLabel('🚗', slot)}</div>` : '';
}
