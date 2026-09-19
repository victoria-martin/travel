/*
  L'onglet Valise du détail : la même valise que le panneau de composition — scopée au voyage, pas
  au scénario — éditable ici au jour le jour. C'est le seul endroit où on ajoute un item propre au
  voyage (maillot de bain) : le formulaire est en ligne, pas une modale, pour rester dans la
  colonne étroite du panneau latéral.
*/
let packingAddFormOpen = false;

function toggleScenarioPackingForm() {
  packingAddFormOpen = !packingAddFormOpen;
  render();
}

function scenarioPackingBlock() {
  const items = travelPackingItems();
  const done = items.filter((i) => i.checked).length;
  const pct = items.length ? Math.round((done / items.length) * 100) : 0;
  return /* HTML */ `<div class="scenario-extra scenario-extra-packing">
    <div class="scenario-extra-head">
      <div class="acc-recap-title">Valise</div>
    </div>
    ${
      items.length
        ? /* HTML */ `<div class="packing-progress-row">
            <div class="packing-progress-track">
              <div class="packing-progress-fill" style="width:${pct}%"></div>
            </div>
            <span class="packing-progress-label">${done} / ${items.length} emballés</span>
          </div>`
        : ''
    }
    <div class="scenario-extra-actions">
      ${toolbarButton({ icon: svgIcon('plus'), label: 'item', onclick: 'toggleScenarioPackingForm()' })}
    </div>
    ${packingAddFormOpen ? scenarioPackingAddForm() : ''}
    ${
      items.length === 0
        ? /* HTML */ `<div class="scenario-extra-empty">
            Aucun item — compose la valise depuis la page Valise, ou ajoute un item propre à ce
            voyage.
          </div>`
        : groupPackingByCategory(items, packingLineCategory)
            .map((g) => scenarioPackingGroup(g))
            .join('')
    }
  </div>`;
}

function scenarioPackingGroup(group) {
  const done = group.items.filter((i) => i.checked).length;
  return /* HTML */ `<details
    class="packing-group"
    ${isPackingGroupOpen(group.category) ? 'open' : ''}
    ontoggle="setPackingGroupOpen('${escapeHtml(group.category)}', this.open)"
  >
    <summary>
      ${escapeHtml(group.category)}
      <span class="packing-group-count">${done}/${group.items.length}</span>
    </summary>
    ${group.items.map((i) => scenarioPackingRow(i)).join('')}
  </details>`;
}

function scenarioPackingRow(item) {
  return /* HTML */ `<div class="pack-row ${item.checked ? '' : 'unpacked'}">
    <input type="checkbox" ${item.checked ? 'checked' : ''} onchange="togglePackingChecked('${item.id}')" />
    <span class="pack-label">
      ${escapeHtml(packingLineLabel(item))}
      ${
        item.packingItemId
          ? `<span class="pack-link-icon" title="Depuis le catalogue">${svgIcon('link')}</span>`
          : `<span class="pack-voyage-badge" title="Propre à ce voyage">voyage</span>`
      }
    </span>
    ${packingQuantityDropdown(item)}
    <button class="icon-btn" onclick="removeFromTravelPacking('${item.id}')" title="Retirer de la valise">
      ${svgIcon('x')}
    </button>
  </div>`;
}

function scenarioPackingAddForm() {
  return /* HTML */ `<div class="add-item-form">
    <div class="field">
      <label>Libellé</label>
      <input id="packing-add-label" type="text" placeholder="Maillot de bain" />
    </div>
    <div class="add-item-form-row">
      ${packingCategoryField('packing-add-category', '')}
      <div class="field packing-add-qty">
        <label>Qté</label>
        <input id="packing-add-quantity" type="number" min="0" value="1" />
      </div>
    </div>
    <label class="filter-option" style="padding:0 0 6px 0;">
      <input id="packing-add-also-global" type="checkbox" />
      Ajouter aussi au catalogue
    </label>
    <div class="modal-actions">
      <button class="btn btn-ghost" onclick="toggleScenarioPackingForm()">Annuler</button>
      <button class="btn" onclick="addScenarioPackingItem()">Ajouter</button>
    </div>
  </div>`;
}

function addScenarioPackingItem() {
  const label = document.getElementById('packing-add-label').value.trim();
  if (!label) return;
  const category = document.getElementById('packing-add-category').value.trim();
  const quantity = parseInt(document.getElementById('packing-add-quantity').value) || 0;
  const alsoGlobal = document.getElementById('packing-add-also-global').checked;

  let packingItemId = null;
  if (alsoGlobal) {
    packingItemId = uid();
    state.packingItems.push({ id: packingItemId, label, category, notes: '' });
  }

  state.packingListItems.push({
    id: uid(),
    travelId: currentTravelId(),
    packingItemId,
    label: packingItemId ? '' : label,
    category: packingItemId ? '' : category,
    quantity,
    perNight: false,
    checked: false,
  });
  saveNow();
  packingAddFormOpen = false;
  render();
}
