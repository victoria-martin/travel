COLUMN_SETS.voitures = [
  { key: 'default', label: '', locked: true, cell: defaultCarCell },
  {
    key: 'name',
    label: 'Loueur',
    locked: true,
    cell: (c) => `${escapeHtml(c.name) || '—'}<div class="row-notes">${carNotesEditable(c)}</div>`,
    sortValue: (c) => (c.name || '').toLowerCase(),
  },
  {
    key: 'model',
    label: 'Modèle',
    cell: (c) => escapeHtml(c.model) || '—',
    sortValue: (c) => (c.model || '').toLowerCase(),
  },
  {
    key: 'price',
    label: 'Prix',
    cell: (c) => escapeHtml(c.price) || '—',
    sortValue: (c) => (c.price || '').toLowerCase(),
  },
  {
    key: 'dates',
    label: 'Dates',
    cell: (c) => escapeHtml(c.dates) || '—',
    sortValue: (c) => (c.dates || '').toLowerCase(),
  },
  {
    key: 'location',
    label: 'Lieu de prise en charge',
    cell: (c) => escapeHtml(c.location) || '—',
    sortValue: (c) => (c.location || '').toLowerCase(),
  },
  { key: 'link', label: 'Lien', cell: linkCell },
  {
    key: 'actions',
    label: '',
    locked: true,
    nowrap: true,
    cell: (c) =>
      /* HTML */ `<button
          class="icon-btn"
          onclick="openModal('voiture','${c.id}')"
          title="Modifier"
        >
          ✎
        </button>
        <button class="icon-btn" onclick="deleteItem('cars','${c.id}')" title="Supprimer">
          🗑
        </button>`,
  },
];
