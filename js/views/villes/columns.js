/*
  Mêmes lieux que Lieux & activités, mêmes cellules — seule la ville passe en tête et en tri par
  défaut. Une table à soi (prefs.sort/hiddenColumns clés `cities`) pour que masquer une colonne ici
  ne touche pas l'autre page. Clé lue aussi par src/domains/cities/ (délégation, pas de doublon).
*/
COLUMN_SETS.cities = [
  {
    key: 'favorite',
    label: '',
    pickerLabel: '⭐ Favori',
    locked: true,

    sortValue: (a) => (a.favorite ? 0 : 1),
    sortLabels: { asc: "Favoris d'abord ⭐", desc: 'Favoris en dernier' },
  },
  {
    key: 'city',
    label: 'Ville',
    locked: true,

    filterValues: (a) => [a.city],
    sortValue: (a) => (a.city || '').toLowerCase(),
  },
  {
    key: 'name',
    label: 'Nom',
    locked: true,

    sortValue: (a) => (a.name || '').toLowerCase(),
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
    key: 'tags',
    label: 'Tags',
    filterValues: (a) => a.tags || [],
  },
  {
    key: 'description',
    label: 'Description',
    hiddenByDefault: true,
  },
  { key: 'actions', label: '', locked: true },
];

SORT_DEFAULTS.cities = [
  { key: 'city', dir: 'asc' },
  { key: 'name', dir: 'asc' },
];
