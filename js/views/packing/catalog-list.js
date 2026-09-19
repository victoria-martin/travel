function packingCatalogBody() {
  const items = filteredPackingItems();
  if (!items.length)
    return emptyState('Catalogue vide', 'Ajoute ce que tu emportes en général — un item à la fois.');
  const groups = groupPackingByCategory(items, (i) => i.category);
  return groups.map((g) => packingCatalogGroup(g)).join('');
}

function packingCatalogGroup(group) {
  return /* HTML */ `<details
    class="packing-group"
    ${isPackingGroupOpen(group.category) ? 'open' : ''}
    ontoggle="setPackingGroupOpen('${escapeHtml(group.category)}', this.open)"
  >
    <summary>
      ${escapeHtml(group.category)} <span class="packing-group-count">${group.items.length}</span>
    </summary>
    ${group.items.map((i) => packingCatalogRow(i)).join('')}
  </details>`;
}

function packingCatalogRow(item) {
  return /* HTML */ `<div class="packing-row">
    <span class="packing-row-label">${escapeHtml(item.label)}</span>
    <span class="packing-row-notes">${packingItemNotesEditable(item)}</span>
    <span class="packing-row-actions">
      ${editButton('valise-catalogue', item.id)}
      <button class="icon-btn" onclick="deletePackingItem('${item.id}')" title="Supprimer">
        ${svgIcon('trash-2')}
      </button>
    </span>
  </div>`;
}

function packingItemNotesEditable(item) {
  return editableText(item.notes, `setPackingItemNotes('${item.id}', this.innerText)`, {
    key: `packing-item:${item.id}:notes`,
    placeholder: 'Notes…',
  });
}

function setPackingItemNotes(id, notes) {
  const value = notes.trim();
  getPackingItem(id).notes = value;
  saveNow();
  syncEditable(`packing-item:${id}:notes`, value);
}
