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
    key: 'category',
    label: 'Catégorie',
    cell: fixedCostCategoryCell,
    sortValue: (c) => (c.category || '').toLowerCase(),
  },
  {
    key: 'recurrence',
    label: 'Récurrence',
    cell: fixedCostRecurrenceCell,
    sortValue: (c) => (c.recurrence || '').toLowerCase(),
  },
  { key: 'actions', label: '', locked: true, nowrap: true, cell: fixedCostActionsCell },
];

function fixedCostLabelCell(c) {
  return `${textCell(c.label)}<div class="row-notes">${fixedCostNotesEditable(c)}</div>`;
}

function fixedCostAmountCell(c) {
  return textCell(c.amount);
}

function fixedCostCategoryCell(c) {
  return textCell(c.category);
}

function fixedCostRecurrenceCell(c) {
  return textCell(c.recurrence);
}

// duplicateFixedCostButton
function fixedCostActionsCell(c) {
  const duplicate = duplicateButton(`duplicateFixedCost('${c.id}')`);
  return `${editButton('charge', c.id)}${duplicate}${deleteButton('fixedCosts', c.id)}`;
}
