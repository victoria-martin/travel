const ACCOMMODATION_COLUMNS = [
  {
    key: 'favorite',
    label: '',
    pickerLabel: '⭐ Favori',
    locked: true,

    sortValue: (a) => (a.favorite ? 0 : 1),
    sortLabels: { asc: "Favoris d'abord ⭐", desc: 'Favoris en dernier' },
  },
  { key: 'name', label: 'Nom', locked: true },
  {
    key: 'chosenStep',
    filter: false,
    label: 'Étape',

    sortValue: (a) => chosenStepSortValue({ accommodationId: a.id }),
  },
  {
    key: 'type',
    label: 'Type',

    sortValue: (a) => accTypeKey(a.type),
    sortOrder: {
      key: 'accommodationType',
      dict: ACCOMMODATION_TYPES,
      label: 'Ordre des types',
    },
  },
  {
    key: 'status',
    label: 'Statut',

    sortValue: (a) => accStatusKey(a.status),
    sortOrder: {
      key: 'accommodationStatus',
      dict: ACCOMMODATION_STATUSES,
      label: 'Ordre des statuts',
    },
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
    key: 'tags',
    label: 'Tags',
    filterValues: (a) => a.tags || [],
  },
  { key: 'address', label: 'Adresse', hiddenByDefault: true },
  { key: 'price', label: 'Prix' },
  { key: 'dates', label: 'Dates' },
  {
    key: 'availableFrom',
    label: 'Disponible du',

    sortValue: (a) => a.availableFrom || '',
  },
  {
    key: 'availableTo',
    label: 'Disponible au',

    sortValue: (a) => a.availableTo || '',
  },
  {
    key: 'notes',
    label: 'Notes',
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
  { key: 'bookingLink', label: 'Booking' },
  {
    key: 'googleMaps',
    label: 'Google Maps',
  },
  { key: 'actions', label: '', locked: true },
];

COLUMN_SETS.hebergements = ACCOMMODATION_COLUMNS;

SORT_DEFAULTS.hebergements = [
  { key: 'chosenStep', dir: 'asc' },
  { key: 'favorite', dir: 'asc' },
  { key: 'updatedAt', dir: 'desc' },
  { key: 'type', dir: 'asc' },
  { key: 'status', dir: 'asc' },
];
