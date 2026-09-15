function emptyFixedCost() {
  return {
    id: null,
    label: '',
    amount: '',
    categories: [],
    recurrence: DEFAULT_EXPENSE_RECURRENCE,
    notes: '',
  };
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
    ${tagsField(p, { field: 'categories', label: 'Catégories', options: allFixedCostCategories })}
    <div class="field">
      <label>Récurrence</label>
      <select id="cost-recurrence">
        ${Object.entries(EXPENSE_RECURRENCES)
          .map(
            ([key, r]) =>
              `<option value="${key}" ${expenseRecurrenceKey(p.recurrence) === key ? 'selected' : ''}>${r.emoji} ${r.label}</option>`,
          )
          .join('')}
      </select>
    </div>
    <div class="field">
      <label>Notes</label><textarea id="cost-notes" rows="2">${escapeHtml(p.notes)}</textarea>
    </div>
    <div class="modal-actions">
      <button class="btn btn-ghost" onclick="dismissModal()">Annuler</button>
      <button class="btn" id="f-save" onclick="saveFixedCost('${p.id || ''}')">Enregistrer</button>
    </div>
  `;
}
