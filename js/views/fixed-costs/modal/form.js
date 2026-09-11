function emptyFixedCost() {
  return { id: null, label: '', amount: '', category: '', recurrence: '', notes: '' };
}

function fixedCostForm(p) {
  return /* HTML */ `
    <h3>${p.id ? 'Modifier' : 'Ajouter'} une charge fixe</h3>
    <div class="field">
      <label>Libellé</label
      ><input id="cost-label" type="text" value="${escapeHtml(p.label)}" placeholder="Péages" />
    </div>
    <div class="field">
      <label>Montant</label><input id="cost-amount" type="text" value="${escapeHtml(p.amount)}" />
    </div>
    <div class="field">
      <label>Catégorie</label
      ><input id="cost-category" type="text" value="${escapeHtml(p.category)}" />
    </div>
    <div class="field">
      <label>Récurrence</label
      ><input id="cost-recurrence" type="text" value="${escapeHtml(p.recurrence)}" />
    </div>
    <div class="field">
      <label>Notes</label><textarea id="cost-notes" rows="2">${escapeHtml(p.notes)}</textarea>
    </div>
    <div class="modal-actions">
      <button class="btn btn-ghost" onclick="dismissModal()">Annuler</button>
      <button class="btn" onclick="saveFixedCost('${p.id || ''}')">Enregistrer</button>
    </div>
  `;
}
