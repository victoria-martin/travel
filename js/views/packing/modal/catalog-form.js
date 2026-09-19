function emptyPackingItem() {
  return { id: null, label: '', category: '', notes: '' };
}

function packingCatalogForm(p) {
  return /* HTML */ `
    <h3>${p.id ? 'Modifier' : 'Ajouter'} un item du catalogue</h3>
    <div class="field">
      <label>Libellé</label>
      <input
        id="packing-item-label"
        type="text"
        value="${escapeHtml(p.label)}"
        placeholder="Trousse de toilette"
      />
    </div>
    ${packingCategoryField('packing-item-category', p.category)}
    <div class="field">
      <label>Notes</label>
      <textarea id="packing-item-notes" rows="2">${escapeHtml(p.notes)}</textarea>
    </div>
    <div class="modal-actions">
      <button class="btn btn-ghost" onclick="dismissModal()">Annuler</button>
      <button class="btn" id="f-save" onclick="savePackingItem('${p.id || ''}')">
        Enregistrer
      </button>
    </div>
  `;
}
