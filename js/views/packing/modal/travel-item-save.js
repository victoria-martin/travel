/*
  « Aussi ajouter au catalogue » crée l'entrée du catalogue et bascule l'item du voyage dessus :
  au prochain voyage, il n'aura qu'à être re-pioché, pas retapé.
*/
function savePackingTravelItem(id) {
  const label = document.getElementById('packing-travel-label').value.trim();
  const categories = [...modal.payload.categories];
  const perNight = document.getElementById('packing-travel-per-night').checked;
  const quantity = parseInt(document.getElementById('packing-travel-quantity').value) || 0;
  const alsoGlobal = document.getElementById('packing-travel-also-global').checked;

  let packingItemId = modal.payload.packingItemId || null;
  if (alsoGlobal && !packingItemId) {
    packingItemId = uid();
    state.packingItems.push({ id: packingItemId, label, categories, notes: '' });
  }

  const item = {
    id: id || uid(),
    travelId: currentTravelId(),
    packingItemId,
    label: packingItemId ? '' : label,
    categories: packingItemId ? [] : categories,
    quantity,
    perNight,
    checked: modal.payload.checked || false,
  };

  if (id) {
    const idx = state.packingListItems.findIndex((i) => i.id === id);
    state.packingListItems[idx] = item;
  } else {
    state.packingListItems.push(item);
  }
  saveNow();
  closeModal();
}
