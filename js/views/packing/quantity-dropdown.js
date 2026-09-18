// Sur le modèle d'extraCountDropdown : un nombre fixe, ou « 1 par nuit » du scénario retenu.
function packingQuantityDropdown(item) {
  const current = packingItemQuantity(item);
  return inlineDropdown(
    `packing-quantity:${item.id}`,
    'packing-quantity-dropdown',
    /* HTML */ `<summary class="inline-tag">${packingQuantityLabel(item)}</summary>
      <div class="inline-menu">
        <button
          class="inline-menu-item ${item.perNight ? 'selected' : ''}"
          onclick="setPackingPerNight('${item.id}')"
        >
          1 par nuit
        </button>
        ${Array.from({ length: MAX_PACKING_QUANTITY }, (_, i) => i + 1)
          .map(
            (n) => `<button
              class="inline-menu-item ${!item.perNight && n === current ? 'selected' : ''}"
              onclick="setPackingQuantity('${item.id}',${n})"
            >
              ${n}
            </button>`,
          )
          .join('')}
      </div>`,
  );
}

function setPackingQuantity(id, n) {
  openInlineMenu = null;
  const item = getPackingListItem(id);
  item.quantity = n;
  item.perNight = false;
  saveNow();
  render();
}

function setPackingPerNight(id) {
  openInlineMenu = null;
  getPackingListItem(id).perNight = true;
  saveNow();
  render();
}
