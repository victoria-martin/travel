/*
  Composer la valise du voyage : piocher dans le catalogue, jumeau de scenarioExpenseDropdown.
  Un item déjà dans la valise de ce voyage sort de la liste — le cocher ici l'ajoute, pas de
  double emploi possible pour une même entrée du catalogue.
*/
function packingCatalogMatches() {
  const used = new Set(travelPackingItems().map((i) => i.packingItemId).filter(Boolean));
  return sortedPackingItems().filter((item) => !used.has(item.id));
}

function attachCatalogItemToTravel(catalogId) {
  openInlineMenu = null;
  state.packingListItems.push({
    id: uid(),
    travelId: currentTravelId(),
    packingItemId: catalogId,
    label: '',
    categories: [],
    quantity: 1,
    perNight: false,
    checked: false,
  });
  saveNow();
  render();
}

function packingComposeDropdown() {
  const attachable = packingCatalogMatches();
  return inlineDropdown(
    'packing-compose',
    'packing-compose-dropdown',
    /* HTML */ `<summary class="inline-tag">
        ${tagLabel(svgIcon('luggage'), 'Ajouter depuis le catalogue')}
      </summary>
      <div class="inline-menu">
        ${
          attachable.length === 0
            ? '<div class="inline-menu-group">Rien de plus dans le catalogue</div>'
            : attachable
                .map(
                  (item) => `<button
                  class="inline-menu-item"
                  onclick="attachCatalogItemToTravel('${item.id}')"
                >
                  <span class="inline-label">${escapeHtml(item.label)}</span>
                </button>`,
                )
                .join('')
        }
      </div>`,
  );
}
