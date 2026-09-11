COLUMN_SETS.charges = [
  {
    key: 'label',
    label: 'Libellé',
    locked: true,
    cell: (c) =>
      `${escapeHtml(c.label) || '—'}<div class="row-notes">${fixedCostNotesEditable(c)}</div>`,
    sortValue: (c) => (c.label || '').toLowerCase(),
  },
  {
    key: 'amount',
    label: 'Montant',
    cell: (c) => escapeHtml(c.amount) || '—',
    sortValue: (c) => (c.amount || '').toLowerCase(),
  },
  {
    key: 'category',
    label: 'Catégorie',
    cell: (c) => escapeHtml(c.category) || '—',
    sortValue: (c) => (c.category || '').toLowerCase(),
  },
  {
    key: 'recurrence',
    label: 'Récurrence',
    cell: (c) => escapeHtml(c.recurrence) || '—',
    sortValue: (c) => (c.recurrence || '').toLowerCase(),
  },
  {
    key: 'actions',
    label: '',
    locked: true,
    nowrap: true,
    cell: (c) =>
      /* HTML */ `<button class="icon-btn" onclick="openModal('charge','${c.id}')" title="Modifier">
          ✎
        </button>
        <button class="icon-btn" onclick="deleteItem('fixedCosts','${c.id}')" title="Supprimer">
          🗑
        </button>`,
  },
];
