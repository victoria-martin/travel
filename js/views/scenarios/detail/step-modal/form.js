function emptyStep() {
  return {
    id: null,
    name: '',
    arrivalDate: '',
    notes: '',
    extras: [],
    hidden: false,
    groupId: '',
    optionId: '',
    attractionId: null,
    accommodationId: null,
    accommodationType: '',
    nights: 1,
    budget: '',
  };
}

function stepForm(p) {
  return /* HTML */ `
    <h3>${p.id ? 'Modifier' : 'Ajouter'} une étape</h3>
    <div class="field">
      <label>Nom</label
      ><input id="s-name" type="text" value="${escapeHtml(p.name)}" placeholder="Arrivée à Pise" />
    </div>
    <div class="field-row">
      <div class="field">
        <label>Nuits</label><input id="s-nights" type="number" min="0" value="${stepNights(p)}" />
      </div>
      <div class="field">
        <label>Budget</label
        ><input
          id="s-budget"
          type="text"
          value="${escapeHtml(p.budget)}"
          placeholder="Remplace le prix de l'hébergement"
        />
      </div>
    </div>
    <div class="field">
      <label>Date d'arrivée</label
      ><input id="s-date" type="text" value="${escapeHtml(p.arrivalDate)}" placeholder="12 juin" />
    </div>
    ${stepAttractionsField(p)}
    <div class="field">
      <label>Notes</label><textarea id="s-notes" rows="2">${escapeHtml(p.notes)}</textarea>
    </div>
    <div class="modal-actions">
      <button class="btn btn-ghost" onclick="dismissModal()">Annuler</button>
      <button class="btn" id="f-save" onclick="saveStep('${p.id || ''}')">Enregistrer</button>
    </div>
  `;
}
