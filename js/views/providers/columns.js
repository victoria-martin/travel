COLUMN_SETS.prestataires = [
  { key: 'logo', label: '', locked: true },
  {
    key: 'name',
    label: 'Nom',
    locked: true,

    sortValue: (p) => (p.name || '').toLowerCase(),
  },
  {
    key: 'mode',
    label: 'Mode',

    sortValue: (p) => providerModeKey(p.mode),
    sortOrder: { key: 'transportMode', dict: PROVIDER_MODES, label: 'Ordre des modes' },
  },
  { key: 'options', label: 'Options' },
  { key: 'models', label: 'Modèles' },
  { key: 'site', label: 'Site' },
  { key: 'booking', label: 'Réservation' },
  { key: 'notes', label: 'Notes', hiddenByDefault: true },
  { key: 'actions', label: '', locked: true },
];

SORT_DEFAULTS.prestataires = [
  { key: 'mode', dir: 'asc' },
  { key: 'name', dir: 'asc' },
];
