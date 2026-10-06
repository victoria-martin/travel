COLUMN_SETS.transports = [
  {
    key: 'favorite',
    label: '',
    pickerLabel: '⭐ Favori',
    locked: true,

    sortValue: (t) => (t.favorite ? 0 : 1),
    sortLabels: { asc: "Favoris d'abord ⭐", desc: 'Favoris en dernier' },
  },
  {
    key: 'mode',
    label: 'Mode',
    locked: true,

    sortValue: (t) => transportModeKey(t.mode),
    sortOrder: { key: 'transportMode', dict: TRANSPORT_MODES, label: 'Ordre des modes' },
  },
  {
    key: 'from',
    label: 'Départ',

    sortValue: (t) => transportEndpointLabel(t.fromAttractionId, t.fromPrecision).toLowerCase(),
  },
  {
    key: 'to',
    label: 'Arrivée',

    sortValue: (t) => transportEndpointLabel(t.toAttractionId, t.toPrecision).toLowerCase(),
  },
  {
    key: 'departure',
    label: 'Part le',

    sortValue: (t) => transportMoment(t.departDate, t.departTime),
  },
  {
    key: 'arrival',
    label: 'Arrive le',

    hiddenByDefault: true,

    sortValue: (t) => transportMoment(t.arriveDate, t.arriveTime),
  },
  {
    key: 'provider',
    label: 'Compagnie / loueur',

    sortValue: (t) => providerName(t.providerId).toLowerCase(),
  },
  {
    key: 'price',
    label: 'Prix',

    sortValue: (t) => priceNumber(t.amountMin || t.amountMax || t.budget),
  },
  {
    key: 'status',
    label: 'Statut',

    sortValue: (t) => transportStatusKey(t.status),
    sortOrder: {
      key: 'transportStatus',
      dict: TRANSPORT_STATUSES,
      label: 'Ordre des statuts',
    },
  },
  { key: 'link', label: 'Lien' },
  { key: 'notes', label: 'Notes', hiddenByDefault: true },
  { key: 'actions', label: '', locked: true },
];

SORT_DEFAULTS.transports = [
  { key: 'departure', dir: 'asc' },
  { key: 'mode', dir: 'asc' },
];
