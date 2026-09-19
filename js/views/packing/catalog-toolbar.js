function packingCatalogChips() {
  const set = new Set(state.packingItems.map((i) => i.category || UNCATEGORIZED));
  const categories = Array.from(set).sort((a, b) => a.localeCompare(b, 'fr'));
  return /* HTML */ `<div class="filter-pills">
    ${filterPill({
      label: 'Toutes',
      active: !packingCatalogCategoryFilter,
      onclick: 'setPackingCatalogCategoryFilter(null)',
    })}
    ${categories
      .map((c) =>
        filterPill({
          label: c,
          active: packingCatalogCategoryFilter === c,
          onclick: `setPackingCatalogCategoryFilter('${escapeHtml(c)}')`,
        }),
      )
      .join('')}
  </div>`;
}

function packingCatalogToolbar() {
  return /* HTML */ `<div class="packing-toolbar">
    <input
      id="packing-catalog-search"
      class="filter-search"
      style="width:220px; margin-bottom:0;"
      type="text"
      placeholder="Rechercher un item…"
      oninput="repaintPackingCatalogBody()"
    />
    ${packingCatalogChips()}
    <div class="packing-toolbar-spacer"></div>
    <button class="btn btn-ghost" onclick="openModal('valise-catalogue')">
      ${svgIcon('plus')} Nouvel item
    </button>
    <button class="btn" onclick="openSheet('valise-composer')">
      ${svgIcon('luggage')} Composer la valise
    </button>
  </div>`;
}
