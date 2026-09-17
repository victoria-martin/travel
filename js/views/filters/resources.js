/*
  Une ressource : la collection qu'on lit, et la clé de colonnes que sa page déclare. La clé étant
  celle de la page, `listTable` et ses colonnes valent partout où on la filtre — la page elle-même,
  la carte, une liste enregistrée.
*/
const LIST_RESOURCES = [
  {
    kind: 'hebergements',
    label: 'Hébergements',
    icon: svgIcon('house'),
    items: () => state.accommodations,
  },
  {
    kind: 'attractions',
    label: 'Lieux & activités',
    icon: svgIcon('landmark'),
    items: () => state.attractions,
  },
  {
    kind: 'transports',
    label: 'Transports',
    icon: svgIcon('plane'),
    items: () => state.transports,
  },
  {
    kind: 'locations',
    label: 'Offres de voiture',
    icon: svgIcon('car'),
    items: () => state.offers,
  },
  { kind: 'charges', label: 'Dépenses', icon: EXPENSE_ICON, items: () => state.fixedCosts },
];

function listResource(kind) {
  return LIST_RESOURCES.find((r) => r.kind === kind) || LIST_RESOURCES[0];
}

function resourceItems(kind) {
  return sortItems(kind, ofCurrentTravel(listResource(kind).items()));
}
