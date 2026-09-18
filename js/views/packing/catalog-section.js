// Le catalogue : sur le modèle de carModelsSection, une liste indépendante du voyage ouvert.
function packingCatalogSection() {
  const items = sortItems('valise', sortedPackingItems());
  return /* HTML */ `<section class="list-section">
    ${packingCatalogHeader(items)}
    ${
      items.length === 0
        ? emptyState('Catalogue vide', 'Ajoute ce que tu emportes en général — un item à la fois.')
        : listViewMode.valise === 'table'
          ? listTable('valise', items)
          : packingCatalogCards(items)
    }
  </section>`;
}
