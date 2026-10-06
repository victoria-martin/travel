COLUMN_SETS.charges = [
  {
    key: 'label',
    label: 'Libellé',
    locked: true,

    sortValue: (c) => (c.label || '').toLowerCase(),
  },
  {
    key: 'amount',
    label: 'Montant',

    sortValue: (c) => (c.amount || '').toLowerCase(),
  },
  {
    key: 'categories',
    label: 'Catégories',
    filterValues: (c) => c.categories || [],

    sortValue: (c) => (c.categories || []).join(', ').toLowerCase(),
  },
  {
    key: 'recurrence',
    label: 'Récurrence',

    sortValue: (c) => expenseRecurrenceKey(c.recurrence),
    sortOrder: {
      key: 'expenseRecurrence',
      dict: EXPENSE_RECURRENCES,
      label: 'Ordre des récurrences',
    },
  },
  { key: 'actions', label: '', locked: true },
];
