/*
  Un item de valise qui référence une entrée du catalogue n'a pas son propre libellé : la
  supprimer sans rien faire le laisserait sans nom. Elle se détache donc d'abord — le libellé et
  les catégories qu'elle dérivait se figent sur l'item, comme une option de prestataire retirée
  quitte les offres qui l'avaient cochée.
*/
function deletePackingItem(id) {
  if (!confirm('Supprimer cet item du catalogue ?')) return;
  const item = getPackingItem(id);
  state.packingListItems
    .filter((line) => line.packingItemId === id)
    .forEach((line) => {
      line.label = item.label;
      line.categories = [...(item.categories || [])];
      line.packingItemId = null;
    });
  state.packingItems = state.packingItems.filter((i) => i.id !== id);
  saveNow();
  render();
}
