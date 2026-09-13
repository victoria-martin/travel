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
];

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
      Rien à calculer — aucun hébergement réservé, aucune voiture par défaut.
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
