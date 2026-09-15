function emptyCar() {
  return {
    id: null,
    status: '',
    providerId: '',
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
    ${providerSelectField('car-provider', 'car', p.providerId)}
    <div class="field">
      <label>Modèle</label><input id="car-model" type="text" value="${escapeHtml(p.model)}" />
    </div>
    <div class="field">
      <label>Statut</label>
      <select id="car-status">
        <option value="" ${p.status ? '' : 'selected'}>
          ${UNSET_CAR_STATUS.emoji} ${UNSET_CAR_STATUS.label}
        </option>
        ${Object.entries(CAR_STATUSES)
          .map(
            ([key, s]) =>
              `<option value="${key}" ${p.status === key ? 'selected' : ''}>${s.emoji} ${s.label}</option>`,
          )
          .join('')}
      </select>
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
      <button class="btn" id="f-save" onclick="saveCar('${p.id || ''}')">Enregistrer</button>
    </div>
  `;
}
