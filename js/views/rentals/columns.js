/*
  Les colonnes d'une offre, lues par la liste de l'onglet Voitures et par les listes filtrées de la
  page À faire. Le tri par défaut range les offres d'un même modèle ensemble, du moins cher au plus
  cher par jour : c'est la lecture qu'on vient chercher, les autres sont un clic d'en-tête.
*/
COLUMN_SETS.locations = [
  { key: 'default', label: '', locked: true },
  {
    key: 'model',
    label: 'Modèle',
    locked: true,

    sortValue: (c) => offerModelName(c).toLowerCase(),
  },
  {
    key: 'provider',
    label: 'Loueur',

    sortValue: (c) => providerName(c.providerId).toLowerCase(),
  },
  {
    key: 'place',
    label: 'Lieu',

    sortValue: (c) => (c.location || '').toLowerCase(),
  },
  {
    key: 'dates',
    label: 'Dates',

    sortValue: (c) => c.pickupDate || '9999',
  },
  {
    key: 'fuel',
    label: 'Motorisation',

    sortValue: (c) => carFuelKey(offerWords(c).fuel),
    sortOrder: { key: 'carFuel', dict: CAR_FUELS, label: 'Ordre des motorisations' },
  },
  {
    key: 'gearbox',
    label: 'Boîte',

    sortValue: (c) => carGearboxKey(offerWords(c).gearbox),
    sortOrder: { key: 'carGearbox', dict: CAR_GEARBOXES, label: 'Ordre des boîtes' },
  },
  {
    key: 'status',
    label: 'Statut',

    sortValue: (c) => carStatusKey(c.status),
    sortOrder: { key: 'carStatus', dict: CAR_STATUSES, label: 'Ordre des statuts' },
  },
  {
    key: 'price',
    label: 'Prix',

    sortValue: (c) => offerDayPrice(c),
  },
  { key: 'options', label: 'Options' },
  { key: 'link', label: 'Lien' },
  { key: 'actions', label: '', locked: true },
];

SORT_DEFAULTS.locations = [
  { key: 'model', dir: 'asc' },
  { key: 'price', dir: 'asc' },
];
