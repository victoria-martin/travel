/*
  Le catalogue du voyage : ce qu'une voiture EST. Ses loueurs et ses offres se lisent ici en
  compte, le détail vivant dans la liste des offres au-dessus.
*/
COLUMN_SETS.modeles = [
  {
    key: 'name',
    label: 'Modèle',
    locked: true,
    cell: (m) => textCell(m.name),
    sortValue: (m) => m.name.toLowerCase(),
  },
  {
    key: 'fuel',
    label: 'Motorisation',
    cell: carFuelTag,
    sortValue: (m) => carFuelKey(m.fuel),
    sortOrder: { key: 'carFuel', dict: CAR_FUELS, label: 'Ordre des motorisations' },
  },
  {
    key: 'gearbox',
    label: 'Boîte',
    cell: carGearboxTag,
    sortValue: (m) => carGearboxKey(m.gearbox),
    sortOrder: { key: 'carGearbox', dict: CAR_GEARBOXES, label: 'Ordre des boîtes' },
  },
  {
    key: 'consumption',
    label: 'Conso',
    nowrap: true,
    cell: (m) => (m.consumption ? `${formatRate(priceNumber(m.consumption))} L/100` : '—'),
    sortValue: (m) => priceNumber(m.consumption),
  },
  {
    key: 'providers',
    label: 'Loueurs',
    cell: carModelProvidersCell,
    sortValue: (m) => carModelProviders(m.id).length,
  },
  {
    key: 'offers',
    label: 'Offres',
    nowrap: true,
    cell: carModelOffersCell,
    sortValue: (m) => carModelOffers(m.id).length,
  },
  { key: 'actions', label: '', locked: true, nowrap: true, cell: carModelActionsCell },
];

SORT_DEFAULTS.modeles = [{ key: 'name', dir: 'asc' }];

function carModelProvidersCell(model) {
  const providers = carModelProviders(model.id);
  if (!providers.length) return '—';
  return providers
    .map((provider) => `<span class="tag-chip">${escapeHtml(provider.name)}</span>`)
    .join('');
}

// Le prix le plus bas relevé sur ce modèle est ce qu'on vient chercher ; sans offre, rien à dire.
function carModelOffersCell(model) {
  const offers = carModelOffers(model.id);
  if (!offers.length) return '—';
  const cheapest = offers.find((offer) => offerDayPrice(offer));
  return [
    `${offers.length} offre${offers.length > 1 ? 's' : ''}`,
    cheapest ? `dès ${offerDayPriceLabel(cheapest)}` : '',
  ]
    .filter(Boolean)
    .join(' · ');
}

function carModelActionsCell(model) {
  return `${editButton('modele', model.id)}${deleteButton('carModels', model.id)}`;
}
