COLUMN_SETS.villes = [
  {
    key: 'name',
    label: 'Ville',
    locked: true,
    cell: (c) => `<strong>${escapeHtml(c.name)}</strong>`,
    sortValue: (c) => (c.name || '').toLowerCase(),
  },
  {
    key: 'place',
    label: 'Adresse à localiser / zone',
    cell: (c) => escapeHtml(cityPlaceLabel(c)),
    sortValue: (c) => cityPlaceLabel(c).toLowerCase(),
  },
  {
    key: 'coords',
    label: 'Coordonnées',
    nowrap: true,
    cell: (c) => escapeHtml(cityCoordsLabel(c)),
  },
  { key: 'notes', label: 'Notes', cell: (c) => escapeHtml(c.notes) || '—' },
  {
    key: 'actions',
    label: '',
    locked: true,
    nowrap: true,
    cell: (c) =>
      /* HTML */ `<button class="icon-btn" onclick="openModal('ville','${c.id}')" title="Modifier">
          ✎
        </button>
        <button class="icon-btn" onclick="deleteItem('cities','${c.id}')" title="Supprimer">
          🗑
        </button>`,
  },
];

SORT_DEFAULTS.villes = [{ key: 'name', dir: 'asc' }];
