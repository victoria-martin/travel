function emptyCity() {
  return {
    id: null,
    name: '',
    geoAddress: '',
    lat: '',
    lng: '',
    county: '',
    region: '',
    notes: '',
  };
}

function cityForm(p) {
  return /* HTML */ `
    <h3>${p.id ? 'Modifier' : 'Ajouter'} une ville</h3>
    <div class="field">
      <label>Nom</label
      ><input id="c-name" type="text" value="${escapeHtml(p.name)}" placeholder="Sienne" />
    </div>
    ${locateFields(p)}
    <div class="field">
      <label>Notes</label><textarea id="c-notes" rows="2">${escapeHtml(p.notes)}</textarea>
    </div>
    <div class="modal-actions">
      <button class="btn btn-ghost" onclick="closeModal()">Annuler</button>
      <button class="btn" id="f-save" onclick="saveCity('${p.id || ''}')">Enregistrer</button>
    </div>
  `;
}
