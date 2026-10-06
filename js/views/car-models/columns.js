/*
  Le catalogue du voyage : ce qu'une voiture EST. Ses loueurs et ses offres se lisent ici en
  compte, le détail vivant dans la liste des offres au-dessus.
*/
COLUMN_SETS.modeles = [
  {
    key: 'name',
    label: 'Modèle',
    locked: true,

    sortValue: (m) => m.name.toLowerCase(),
  },
  {
    key: 'fuel',
    label: 'Motorisation',

    sortValue: (m) => carFuelKey(m.fuel),
    sortOrder: { key: 'carFuel', dict: CAR_FUELS, label: 'Ordre des motorisations' },
  },
  {
    key: 'gearbox',
    label: 'Boîte',

    sortValue: (m) => carGearboxKey(m.gearbox),
    sortOrder: { key: 'carGearbox', dict: CAR_GEARBOXES, label: 'Ordre des boîtes' },
  },
  {
    key: 'consumption',
    label: 'Conso',

    sortValue: (m) => priceNumber(m.consumption),
  },
  {
    key: 'providers',
    label: 'Loueurs',

    sortValue: (m) => carModelProviders(m.id).length,
  },
  {
    key: 'offers',
    label: 'Offres',

    sortValue: (m) => carModelOffers(m.id).length,
  },
  { key: 'actions', label: '', locked: true },
];

SORT_DEFAULTS.modeles = [{ key: 'name', dir: 'asc' }];
