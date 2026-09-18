function emptyPackingListItem() {
  return {
    id: null,
    packingItemId: null,
    label: '',
    categories: [],
    quantity: 1,
    perNight: false,
    checked: false,
    alsoGlobal: false,
  };
}

// Un item propre au voyage (maillot de bain) : pas de référence au catalogue, la case en bas
// l'y ajoute quand même, pour qu'il ressorte au prochain voyage.
function packingTravelItemForm(p) {
  return /* HTML */ `
    <h3>${p.id ? 'Modifier' : 'Ajouter'} un item à la valise</h3>
    <div class="field">
      <label>Libellé</label>
      <input
        id="packing-travel-label"
        type="text"
        value="${escapeHtml(p.label)}"
        placeholder="Maillot de bain"
      />
    </div>
    ${tagsField(p, { field: 'categories', label: 'Catégories', options: allPackingCategories })}
    <div class="field">
      <label>Quantité</label>
      <input
        id="packing-travel-quantity"
        type="number"
        min="0"
        value="${p.quantity || 1}"
        ${p.perNight ? 'disabled' : ''}
      />
    </div>
    <label class="filter-option" style="padding:0 0 6px 0;"
      ><input
        id="packing-travel-per-night"
        type="checkbox"
        ${p.perNight ? 'checked' : ''}
        onchange="document.getElementById('packing-travel-quantity').disabled = this.checked"
      />
      1 par nuit du scénario retenu</label
    >
    <label class="filter-option" style="padding:0 0 6px 0;"
      ><input
        id="packing-travel-also-global"
        type="checkbox"
        ${p.alsoGlobal ? 'checked' : ''}
      />
      Ajouter aussi au catalogue</label
    >
    <div class="modal-actions">
      <button class="btn btn-ghost" onclick="dismissModal()">Annuler</button>
      <button class="btn" id="f-save" onclick="savePackingTravelItem('${p.id || ''}')">
        Enregistrer
      </button>
    </div>
  `;
}
