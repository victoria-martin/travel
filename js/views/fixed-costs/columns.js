COLUMN_SETS.charges = [
  {
    key: 'label',
    label: 'Libellé',
    locked: true,
    cell: fixedCostLabelCell,
    sortValue: (c) => (c.label || '').toLowerCase(),
  },
  {
    key: 'amount',
    label: 'Montant',
    cell: fixedCostAmountCell,
    sortValue: (c) => (c.amount || '').toLowerCase(),
  },
  {
    key: 'categories',
    label: 'Catégories',
    cell: fixedCostCategoriesCell,
    sortValue: (c) => (c.categories || []).join(', ').toLowerCase(),
  },
  {
    key: 'recurrence',
    label: 'Récurrence',
    cell: fixedCostRecurrenceCell,
    sortValue: (c) => expenseRecurrenceKey(c.recurrence),
    sortOrder: {
      key: 'expenseRecurrence',
      dict: EXPENSE_RECURRENCES,
      label: 'Ordre des récurrences',
    },
  },
  { key: 'actions', label: '', locked: true, nowrap: true, cell: fixedCostActionsCell },
];

function fixedCostLabelCell(c) {
  return `${textCell(c.label)}<div class="row-notes">${fixedCostNotesEditable(c)}</div>`;
}

function fixedCostAmountCell(c) {
  return textCell(expenseAmountLabel(c));
}

function fixedCostCategoriesCell(c) {
  return tagsCell(c, {
    field: 'categories',
    getItem: getFixedCost,
    vocabulary: allFixedCostCategories,
    addLabel: '+ catégorie',
  });
}

function fixedCostRecurrenceCell(c) {
  const recurrence = expenseRecurrence(c.recurrence);
  return tagLabel(recurrence.emoji, recurrence.label);
}

// duplicateFixedCostButton
function fixedCostActionsCell(c) {
  const duplicate = duplicateButton(`duplicateFixedCost('${c.id}')`);
  return `${editButton('charge', c.id)}${duplicate}${deleteButton('fixedCosts', c.id)}`;
}
