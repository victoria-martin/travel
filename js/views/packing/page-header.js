function packingPageHeader() {
  const categories = new Set(state.packingItems.map((i) => i.category || UNCATEGORIZED));
  return /* HTML */ `<div class="view-header">
    <div>
      <h2 class="view-title">Valise</h2>
      <p class="view-sub">
        ${state.packingItems.length} item${state.packingItems.length > 1 ? 's' : ''} au catalogue ·
        ${categories.size} catégorie${categories.size > 1 ? 's' : ''}
      </p>
    </div>
    <div class="view-header-actions">${toolbarMenu()}</div>
  </div>`;
}
