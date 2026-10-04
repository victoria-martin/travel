function togglePackingChecked(id) {
  const item = getPackingListItem(id);
  item.checked = !item.checked;
  saveNow();
  render();
}

// An item specific to this trip; ticking "also in catalog" makes it a catalog item the line points to.
function addTravelPackingItem({ label, category, quantity, alsoInCatalog }) {
  let packingItemId = null;
  if (alsoInCatalog) {
    packingItemId = uid();
    state.packingItems.push({ id: packingItemId, label, category, notes: '' });
  }
  state.packingListItems.push({
    id: uid(),
    travelId: currentTravelId(),
    packingItemId,
    label: packingItemId ? '' : label,
    category: packingItemId ? '' : category,
    quantity,
    perNight: false,
    checked: false,
  });
  saveNow();
  render();
}
