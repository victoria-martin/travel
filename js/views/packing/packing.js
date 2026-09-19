// Le catalogue, groupé par catégorie ; composer la valise du voyage se fait depuis le panneau
// « Composer la valise », l'édition au jour le jour depuis l'onglet Valise d'un scénario.
function renderPackingView() {
  return /* HTML */ `
    ${packingPageHeader()} ${packingCatalogToolbar()}
    <div id="packing-catalog-body" class="packing-list">${packingCatalogBody()}</div>
  `;
}
