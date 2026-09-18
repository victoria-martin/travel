function savePackingItem(id) {
  const item = {
    id: id || uid(),
    label: document.getElementById('packing-item-label').value.trim(),
    categories: [...modal.payload.categories],
    notes: document.getElementById('packing-item-notes').value.trim(),
  };
  if (id) {
    const idx = state.packingItems.findIndex((i) => i.id === id);
    state.packingItems[idx] = item;
  } else {
    state.packingItems.push(item);
  }
  saveNow();
  closeModal();
}
