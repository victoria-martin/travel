function travelPackingItemFor(catalogId) {
  return travelPackingItems().find((i) => i.packingItemId === catalogId);
}

function toggleCatalogItemInTravel(catalogId) {
  const existing = travelPackingItemFor(catalogId);
  if (existing) {
    state.packingListItems = state.packingListItems.filter((i) => i.id !== existing.id);
  } else {
    state.packingListItems.push({
      id: uid(),
      travelId: currentTravelId(),
      packingItemId: catalogId,
      label: '',
      category: '',
      quantity: 1,
      perNight: false,
      checked: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  saveNow();
  render();
}

function removeFromTravelPacking(id) {
  state.packingListItems = state.packingListItems.filter((i) => i.id !== id);
  saveNow();
  render();
}

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
