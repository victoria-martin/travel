function emptyStep() {
  return {
    id: null,
    city: '',
    region: '',
    arrivalDate: '',
    nights: 1,
    cityId: null,
    accommodationId: null,
    budget: '',
    notes: '',
  };
}

function stepForm(p) {
  return /* HTML */ `
    <h3>${p.id ? 'Modifier' : 'Ajouter'} une étape</h3>
    <div class="field">
      <label>Ville</label
      ><input id="s-city" type="text" value="${escapeHtml(p.city)}" placeholder="Sienne" />
    </div>
    <div class="field-row">
      <div class="field">
        <label>Région</label><input id="s-region" type="text" value="${escapeHtml(p.region)}" />
      </div>
      <div class="field">
        <label>Nuits</label><input id="s-nights" type="number" min="0" value="${p.nights || 0}" />
      </div>
      <div class="field">
        <label>Budget</label
        ><input
          id="s-budget"
          type="text"
          value="${escapeHtml(p.budget)}"
          placeholder="remplace le prix de l'hébergement"
        />
      </div>
    </div>
    <div class="field">
      <label>Date d'arrivée</label
      ><input id="s-date" type="text" value="${escapeHtml(p.arrivalDate)}" placeholder="12 juin" />
    </div>
    <div class="field">
      <label>Notes</label><textarea id="s-notes" rows="2">${escapeHtml(p.notes)}</textarea>
    </div>
    <div class="modal-actions">
      <button class="btn btn-ghost" onclick="dismissModal()">Annuler</button>
      <button class="btn" onclick="saveStep('${p.id || ''}')">Enregistrer</button>
    </div>
  `;
}
