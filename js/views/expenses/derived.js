/*
  Une dépense dérivée se lit sur l'entité qui la porte : on ne la saisit pas ici, on va la
  corriger à sa source. Une source sans montant ferme — un prix par nuit, un prix par jour —
  s'affiche avec son unité et reste hors du total tant que rien ne dit sur combien la multiplier.
*/

const DERIVED_EXPENSE_SOURCES = [
  {
    key: 'accommodations',
    label: 'Hébergements réservés',
    view: 'hebergements',
    lines: () =>
      ofCurrentTravel(state.accommodations)
        .filter((a) => a.status === 'booked')
        .map((a) => ({
          icon: accType(a.type).emoji,
          label: a.name || 'Sans nom',
          unit: a.price ? 'par nuit' : '',
          amount: null,
          display: a.price ? `${formatEuros(priceNumber(a.price))} / nuit` : '—',
        })),
  },
  {
    key: 'car',
    label: 'Voiture par défaut',
    view: 'voitures',
    lines: () => {
      const car = defaultCar();
      if (!car) return [];
      const total = hasPriceValue(car.priceTotal) ? priceNumber(car.priceTotal) : null;
      return [
        {
          icon: '🚗',
          label: carLabel(car),
          unit: total ? '' : 'par jour',
          amount: total,
          display: total
            ? formatEuros(total)
            : car.pricePerDay
              ? `${formatEuros(priceNumber(car.pricePerDay))} / jour`
              : '—',
        },
      ];
    },
  },
  {
    key: 'transports',
    label: 'Transports réservés',
    view: 'transports',
    lines: () =>
      ofCurrentTravel(state.transports)
        .filter((t) => t.status === 'booked')
        .map((t) => ({
          icon: transportMode(t.mode).emoji,
          label: `${transportEndpointLabel(t.fromCityId, t.fromPrecision)} → ${transportEndpointLabel(t.toCityId, t.toPrecision)}`,
          unit: '',
          amount: firmPrice(t),
          display: priceLabel(t),
        })),
  },
  {
    key: 'attractions',
    label: 'À faire, validé',
    view: 'attractions',
    lines: () =>
      ofCurrentTravel(state.attractions)
        .filter((a) => a.status === 'go')
        .map((a) => ({
          icon: attractionType(a.type).emoji,
          label: a.name || 'Sans nom',
          unit: '',
          amount: firmPrice(a),
          display: priceLabel(a),
        })),
  },
];

/*
  Une fourchette ouverte ne sait pas ce qu'elle vaut dans un total : elle s'affiche et reste
  dehors, comme un prix par nuit. Seul un montant unique — les deux bornes égales, ou une seule
  saisie, ou le budget à défaut — entre dans la somme.
*/
function firmPrice(entity) {
  const bounds = [entity.amountMin, entity.amountMax].filter(hasPriceValue).map(priceNumber);
  if (bounds.length === 2) return bounds[0] === bounds[1] ? bounds[0] : null;
  if (bounds.length === 1) return bounds[0];
  return hasPriceValue(entity.budget) ? priceNumber(entity.budget) : null;
}

function derivedExpenseGroups() {
  return DERIVED_EXPENSE_SOURCES.map((source) => ({ ...source, items: source.lines() })).filter(
    (group) => group.items.length,
  );
}

function derivedExpensesTotal() {
  return derivedExpenseGroups()
    .flatMap((group) => group.items)
    .reduce((sum, line) => sum + (line.amount || 0), 0);
}

function derivedExpensesList() {
  const groups = derivedExpenseGroups();
  if (!groups.length) {
    return /* HTML */ `<div class="scenario-extra-empty">
      Rien à calculer — rien de réservé, aucune voiture par défaut.
    </div>`;
  }
  return groups.map(derivedExpenseGroup).join('');
}

function derivedExpenseGroup(group) {
  return /* HTML */ `<div class="expense-group">
    <button class="expense-group-head" onclick="goTo('${group.view}')">
      ${escapeHtml(group.label)}
    </button>
    ${group.items.map(derivedExpenseLine).join('')}
  </div>`;
}

function derivedExpenseLine(line) {
  return /* HTML */ `<div class="expense-line">
    <span class="expense-icon">${line.icon}</span>
    <span class="expense-label">${escapeHtml(line.label)}</span>
    <strong class="expense-amount ${line.amount === null ? 'expense-amount-open' : ''}">
      ${line.display}
    </strong>
  </div>`;
}
