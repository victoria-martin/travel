// Le catalogue : ce qu'on pourrait emporter, tous voyages confondus.
COLUMN_SETS.valise = [
  {
    key: 'label',
    label: 'Libellé',
    locked: true,
    cell: (i) => textCell(i.label),
    sortValue: (i) => (i.label || '').toLowerCase(),
  },
  {
    key: 'categories',
    label: 'Catégories',
    filterValues: (i) => i.categories || [],
    cell: packingItemCategoriesCell,
    sortValue: (i) => (i.categories || []).join(', ').toLowerCase(),
  },
  {
    key: 'notes',
    label: 'Notes',
    cell: (i) => `<div class="row-notes">${packingItemNotesEditable(i)}</div>`,
  },
  { key: 'actions', label: '', locked: true, nowrap: true, cell: packingItemActionsCell },
];

SORT_DEFAULTS.valise = [{ key: 'label', dir: 'asc' }];

function packingItemCategoriesCell(item) {
  return tagsCell(item, {
    field: 'categories',
    getItem: getPackingItem,
    vocabulary: allPackingCategories,
    addLabel: '+ catégorie',
  });
}

function packingItemNotesEditable(item) {
  return editableText(item.notes, `setPackingItemNotes('${item.id}', this.innerText)`, {
    key: `packing-item:${item.id}:notes`,
    placeholder: 'Notes…',
  });
}

function setPackingItemNotes(id, notes) {
  const value = notes.trim();
  getPackingItem(id).notes = value;
  saveNow();
  syncEditable(`packing-item:${id}:notes`, value);
}

function packingItemActionsCell(item) {
  return /* HTML */ `${editButton('valise-catalogue', item.id)}
    <button class="icon-btn" onclick="deletePackingItem('${item.id}')" title="Supprimer">
      ${svgIcon('trash-2')}
    </button>`;
}
