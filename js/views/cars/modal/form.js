function emptyCar() {
  return {
    id: null,
    name: '',
    model: '',
    pricePerDay: '',
    priceTotal: '',
    dates: '',
    location: '',
    link: '',
    notes: '',
  };
}

function carForm(p) {
  return /* HTML */ `
    <h3>${p.id ? 'Modifier' : 'Ajouter'} une voiture</h3>
    <div class="field">
      <label>Loueur</label
      ><input id="car-name" type="text" value="${escapeHtml(p.name)}" placeholder="Hertz" />
    </div>
    <div class="field">
      <label>Modèle</label><input id="car-model" type="text" value="${escapeHtml(p.model)}" />
    </div>
    <div class="field">
      <label>Prix / jour</label
      ><input id="car-price-per-day" type="text" value="${escapeHtml(p.pricePerDay)}" />
    </div>
    <div class="field">
      <label>Prix total</label
      ><input id="car-price-total" type="text" value="${escapeHtml(p.priceTotal)}" />
    </div>
    <div class="field">
      <label>Dates</label><input id="car-dates" type="text" value="${escapeHtml(p.dates)}" />
    </div>
    <div class="field">
      <label>Lieu de prise en charge</label
      ><input id="car-location" type="text" value="${escapeHtml(p.location)}" />
    </div>
    <div class="field">
      <label>Lien</label><input id="car-link" type="text" value="${escapeHtml(p.link)}" />
    </div>
    <div class="field">
      <label>Notes</label><textarea id="car-notes" rows="2">${escapeHtml(p.notes)}</textarea>
    </div>
    <div class="modal-actions">
      <button class="btn btn-ghost" onclick="dismissModal()">Annuler</button>
      <button class="btn" onclick="saveCar('${p.id || ''}')">Enregistrer</button>
    </div>
  `;
}
