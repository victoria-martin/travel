COLUMN_SETS.attractions = [
  {
    key: 'favorite',
    label: '',
    pickerLabel: '⭐ Favori',
    locked: true,

    sortValue: (a) => (a.favorite ? 0 : 1),
    sortLabels: { asc: "Favoris d'abord ⭐", desc: 'Favoris en dernier' },
  },
  {
    key: 'name',
    label: 'Nom',
    locked: true,

    sortValue: (a) => (a.name || '').toLowerCase(),
  },
  {
    key: 'chosenStep',
    filter: false,
    label: 'Étape',

    sortValue: (a) => chosenStepSortValue({ attractionId: a.id }),
  },
  {
    key: 'type',
    label: 'Type',

    sortValue: (a) => attractionTypeKey(a.type),
    sortOrder: { key: 'attractionType', dict: ATTRACTION_TYPES, label: 'Ordre des types' },
  },
  {
    key: 'status',
    label: 'Statut',

    sortValue: (a) => attractionStatusKey(a.status),
    sortOrder: {
      key: 'attractionStatus',
      dict: ATTRACTION_STATUSES,
      label: 'Ordre des statuts',
    },
  },
  {
    key: 'price',
    label: 'Prix',

    sortValue: (a) => priceNumber(a.amountMin || a.amountMax || a.budget),
  },
  {
    key: 'tags',
    label: 'Tags',
    filterValues: (a) => a.tags || [],
  },
  {
    key: 'description',
    label: 'Description',
  },
  {
    key: 'city',
    label: 'Ville',

    filterValues: (a) => [a.city],
    sortValue: (a) => (a.city || '').toLowerCase(),
  },
  {
    key: 'county',
    label: 'Province',

    filterValues: (a) => [a.county],
    sortValue: (a) => (a.county || '').toLowerCase(),
  },
  {
    key: 'region',
    label: 'Région',
    hiddenByDefault: true,

    filterValues: (a) => [a.region],
    sortValue: (a) => (a.region || '').toLowerCase(),
  },
  {
    key: 'country',
    label: 'Pays',
    hiddenByDefault: true,

    filterValues: (a) => [a.country],
    sortValue: (a) => (a.country || '').toLowerCase(),
  },
  {
    key: 'address',
    label: 'Adresse',
    hiddenByDefault: true,

    sortValue: (a) => (a.address || '').toLowerCase(),
  },
  {
    key: 'coords',
    label: 'Coordonnées',

    hiddenByDefault: true,
  },
  {
    key: 'accommodation',
    label: 'Hébergement',
    hiddenByDefault: true,

    sortValue: (a) => attractionAccommodationName(a).toLowerCase(),
  },
  { key: 'hours', label: 'Horaires', hiddenByDefault: true },
  {
    key: 'phone',
    label: 'Téléphone',

    hiddenByDefault: true,
  },
  {
    key: 'createdAt',
    filter: false,
    label: 'Créé le',
    hiddenByDefault: true,

    sortValue: (a) => a.createdAt || '',
  },
  {
    key: 'updatedAt',
    label: 'Modifié le',
    hiddenByDefault: true,
    filter: false,

    sortValue: (a) => a.updatedAt || '',
  },
  { key: 'link', label: 'Lien' },
  { key: 'googleMaps', label: 'Google Maps' },
  { key: 'actions', label: '', locked: true },
];

SORT_DEFAULTS.attractions = [
  { key: 'chosenStep', dir: 'asc' },
  { key: 'updatedAt', dir: 'desc' },
];

function attractionAccommodationName(a) {
  const accommodation = getAccommodation(a.accommodationId);
  return accommodation ? accommodation.name : '';
}
