// La valise du voyage courant : items du catalogue ajoutés ici, et items propres à ce voyage.
COLUMN_SETS.valiseVoyage = [
  { key: 'checked', label: '', locked: true, cell: packingCheckedCell },
  {
    key: 'label',
    label: 'Item',
    locked: true,
    cell: (i) => textCell(packingLineLabel(i)),
    sortValue: (i) => packingLineLabel(i).toLowerCase(),
  },
  {
    key: 'categories',
    label: 'Catégories',
    filterValues: (i) => packingLineCategories(i),
    cell: packingLineCategoriesCell,
    sortValue: (i) => packingLineCategories(i).join(', ').toLowerCase(),
  },
  {
    key: 'quantity',
    label: 'Quantité',
    nowrap: true,
    cell: packingQuantityCell,
    sortValue: (i) => packingItemQuantity(i),
  },
  { key: 'actions', label: '', locked: true, nowrap: true, cell: packingLineActionsCell },
];

SORT_DEFAULTS.valiseVoyage = [{ key: 'categories', dir: 'asc' }];

function packingCheckedCell(item) {
  return /* HTML */ `<input
    type="checkbox"
    ${item.checked ? 'checked' : ''}
    onchange="togglePackingChecked('${item.id}')"
    title="Emballé"
  />`;
}

function togglePackingChecked(id) {
  const item = getPackingListItem(id);
  item.checked = !item.checked;
  saveNow();
  render();
}

// Catégories lues sur le catalogue quand l'item en vient : elles ne s'éditent que là-bas, pas ici.
function packingLineCategoriesCell(item) {
  if (item.packingItemId) return tagChips(packingLineCategories(item)) || '—';
  return tagsCell(item, {
    field: 'categories',
    getItem: getPackingListItem,
    vocabulary: allPackingCategories,
    addLabel: '+ catégorie',
  });
}

function packingQuantityCell(item) {
  return packingQuantityDropdown(item);
}

function packingLineActionsCell(item) {
  const edit = item.packingItemId ? '' : editButton('valise-item', item.id);
  return /* HTML */ `${edit}
    <button
      class="icon-btn"
      onclick="removeFromTravelPacking('${item.id}')"
      title="Retirer de la valise"
    >
      ${svgIcon('x')}
    </button>`;
}

// Retirer une ligne ne touche pas le catalogue : seule la valise de ce voyage perd l'item.
function removeFromTravelPacking(id) {
  state.packingListItems = state.packingListItems.filter((i) => i.id !== id);
  saveNow();
  render();
}
