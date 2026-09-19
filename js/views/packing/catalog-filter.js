/*
  Recherche et catégorie active : un état de geste, comme le repli des groupes — la frappe ne
  repeint que la liste, jamais la page entière, sinon le champ perdrait le focus à chaque lettre.
*/
let packingCatalogQuery = '';
let packingCatalogCategoryFilter = null;

function filteredPackingItems() {
  const needle = packingCatalogQuery.trim().toLowerCase();
  return sortedPackingItems().filter((item) => {
    if (packingCatalogCategoryFilter && (item.category || UNCATEGORIZED) !== packingCatalogCategoryFilter)
      return false;
    return !needle || item.label.toLowerCase().includes(needle);
  });
}

function repaintPackingCatalogBody() {
  packingCatalogQuery = document.getElementById('packing-catalog-search').value;
  document.getElementById('packing-catalog-body').innerHTML = packingCatalogBody();
}

function setPackingCatalogCategoryFilter(category) {
  packingCatalogCategoryFilter = category;
  render();
}
