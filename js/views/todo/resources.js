/*
  A dynamic list draws from a resource: the collection it reads, and the column set its own page
  declares. The key is that page's, so listTable and its columns apply here unchanged.
*/
const TODO_RESOURCES = [
  {
    kind: 'hebergements',
    label: 'Hébergements',
    icon: svgIcon('house'),
    items: () => state.accommodations,
  },
  {
    kind: 'attractions',
    label: 'Activités',
    icon: svgIcon('landmark'),
    items: () => state.attractions,
  },
  {
    kind: 'transports',
    label: 'Transports',
    icon: svgIcon('plane'),
    items: () => state.transports,
  },
  { kind: 'locations', label: 'Locations', icon: svgIcon('car'), items: () => state.offers },
  { kind: 'charges', label: 'Dépenses', icon: EXPENSE_ICON, items: () => state.fixedCosts },
  { kind: 'villes', label: 'Villes', icon: svgIcon('map-pin'), items: () => state.cities },
];

function todoResource(kind) {
  return TODO_RESOURCES.find((r) => r.kind === kind) || TODO_RESOURCES[0];
}

function todoResourceItems(kind) {
  return sortItems(kind, ofCurrentTravel(todoResource(kind).items()));
}
