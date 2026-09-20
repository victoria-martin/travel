/*
  Mêmes lieux que Lieux & activités, mêmes cellules — seule la ville passe en tête et en tri par
  défaut. Une table à soi (prefs.sort/hiddenColumns clés `villes`) pour que masquer une colonne ici
  ne touche pas l'autre page.
*/
COLUMN_SETS.villes = [
  {
    key: 'favorite',
    label: '',
    pickerLabel: '⭐ Favori',
    locked: true,
    cell: attractionFavoriteCell,
    sortValue: (a) => (a.favorite ? 0 : 1),
    sortLabels: { asc: "Favoris d'abord ⭐", desc: 'Favoris en dernier' },
  },
  {
    key: 'city',
    label: 'Ville',
    locked: true,
    cell: attractionCityCell,
    filterValues: (a) => [a.city],
    sortValue: (a) => (a.city || '').toLowerCase(),
  },
  {
    key: 'name',
    label: 'Nom',
    locked: true,
    cell: attractionNameCell,
    sortValue: (a) => (a.name || '').toLowerCase(),
  },
  {
    key: 'type',
    label: 'Type',
    cell: attractionTypeCell,
    sortValue: (a) => attractionTypeKey(a.type),
    sortOrder: { key: 'attractionType', dict: ATTRACTION_TYPES, label: 'Ordre des types' },
  },
  {
    key: 'status',
    label: 'Statut',
    cell: attractionStatusCell,
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
    cell: (a) =>
      tagsCell(a, {
        field: 'tags',
        getItem: getAttraction,
        vocabulary: allAttractionTags,
        addLabel: '+ tag',
      }),
  },
  {
    key: 'description',
    label: 'Description',
    hiddenByDefault: true,
    cell: attractionDescriptionCell,
  },
  { key: 'actions', label: '', locked: true, nowrap: true, cell: attractionActionsCell },
];

SORT_DEFAULTS.villes = [
  { key: 'city', dir: 'asc' },
  { key: 'name', dir: 'asc' },
];
