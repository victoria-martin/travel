/*
  A dynamic list draws from a resource: the collection it reads, and the column set its own page
  declares. The key is that page's, so listTable and its columns apply here unchanged.
*/
const TODO_RESOURCES = [
  { kind: 'hebergements', label: 'Hébergements', emoji: '🏠', items: () => state.accommodations },
  { kind: 'attractions', label: 'Activités', emoji: '🏛️', items: () => state.attractions },
  { kind: 'transports', label: 'Transports', emoji: '✈️', items: () => state.transports },
  { kind: 'voitures', label: 'Voitures', emoji: '🚗', items: () => state.cars },
  { kind: 'charges', label: 'Dépenses', emoji: EXPENSE_EMOJI, items: () => state.fixedCosts },
  { kind: 'villes', label: 'Villes', emoji: '📍', items: () => state.cities },
];

function todoResource(kind) {
  return TODO_RESOURCES.find((r) => r.kind === kind) || TODO_RESOURCES[0];
}

function todoResourceItems(kind) {
  return sortItems(kind, ofCurrentTravel(todoResource(kind).items()));
}
