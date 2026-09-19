/*
  Composer la valise : cocher un item du catalogue l'ajoute à la valise du voyage ouvert,
  décocher le retire — le catalogue, lui, n'est jamais modifié depuis ce panneau.
*/
let packingComposeQuery = '';

function travelPackingItemFor(catalogId) {
  return travelPackingItems().find((i) => i.packingItemId === catalogId);
}

function toggleCatalogItemInTravel(catalogId) {
  const existing = travelPackingItemFor(catalogId);
  if (existing) {
    state.packingListItems = state.packingListItems.filter((i) => i.id !== existing.id);
  } else {
    state.packingListItems.push({
      id: uid(),
      travelId: currentTravelId(),
      packingItemId: catalogId,
      label: '',
      category: '',
      quantity: 1,
      perNight: false,
      checked: false,
    });
  }
  saveNow();
  render();
}

function removeFromTravelPacking(id) {
  state.packingListItems = state.packingListItems.filter((i) => i.id !== id);
  saveNow();
  render();
}

function filteredComposeCatalog() {
  const needle = packingComposeQuery.trim().toLowerCase();
  return sortedPackingItems().filter((item) => !needle || item.label.toLowerCase().includes(needle));
}

function packingComposerSheet() {
  const travel = currentTravel();
  const total = state.packingItems.length;
  const added = travelPackingItems().filter((i) => i.packingItemId).length;
  return /* HTML */ `
    <h3>Composer la valise</h3>
    <p class="view-sub" style="margin:-10px 0 14px;">${escapeHtml((travel && travel.name) || '')}</p>
    <input
      id="packing-compose-search"
      class="filter-search"
      type="text"
      placeholder="Rechercher dans le catalogue…"
      oninput="repaintPackingComposeList()"
    />
    <div id="packing-compose-list" class="packing-list">${packingComposeList()}</div>
    <div class="modal-actions modal-actions-split">
      <p class="view-sub" style="margin:0;">
        <strong>${added}</strong> sur ${total} items du catalogue ajoutés à cette valise
      </p>
      <button class="btn" onclick="closeModal()">Terminé</button>
    </div>
  `;
}

function packingComposeList() {
  const items = filteredComposeCatalog();
  if (!items.length)
    return emptyState('Catalogue vide', "Ajoute d'abord un item au catalogue.");
  const groups = groupPackingByCategory(items, (i) => i.category);
  return groups.map((g) => packingComposeGroup(g)).join('');
}

function packingComposeGroup(group) {
  const inTravel = group.items.filter((i) => travelPackingItemFor(i.id)).length;
  return /* HTML */ `<details
    class="packing-group"
    ${isPackingGroupOpen(group.category) ? 'open' : ''}
    ontoggle="setPackingGroupOpen('${escapeHtml(group.category)}', this.open)"
  >
    <summary>
      ${escapeHtml(group.category)}
      <span class="packing-group-count">${inTravel}/${group.items.length}</span>
    </summary>
    ${group.items.map((i) => packingComposeRow(i)).join('')}
  </details>`;
}

function packingComposeRow(item) {
  const checked = !!travelPackingItemFor(item.id);
  return /* HTML */ `<label class="filter-option packing-compose-row">
    <input type="checkbox" ${checked ? 'checked' : ''} onchange="toggleCatalogItemInTravel('${item.id}')" />
    ${escapeHtml(item.label)}
  </label>`;
}

function repaintPackingComposeList() {
  packingComposeQuery = document.getElementById('packing-compose-search').value;
  document.getElementById('packing-compose-list').innerHTML = packingComposeList();
}
