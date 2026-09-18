function packingCatalogCards(items) {
  return /* HTML */ `<div class="card-grid">${items.map((i) => packingCatalogCard(i)).join('')}</div>`;
}

function packingCatalogCard(item) {
  return /* HTML */ `<div class="card">
    <div class="card-top">
      <p class="card-name">${escapeHtml(item.label) || 'Sans nom'}</p>
    </div>
    <div class="card-meta">
      ${item.categories && item.categories.length ? `<span>${tagChips(item.categories)}</span>` : ''}
      <span>${svgIcon('file-text')} ${packingItemNotesEditable(item)}</span>
    </div>
    <div class="card-actions">
      ${cardEditButton('valise-catalogue', item.id)}
      <button class="btn-danger btn btn-small" onclick="deletePackingItem('${item.id}')">
        Suppr.
      </button>
    </div>
  </div>`;
}
