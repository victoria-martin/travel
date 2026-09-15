function emptyOffer() {
  return {
    id: null,
    rentalId: '',
    modelId: '',
    status: '',
    model: '',
    priceTotal: '',
    pricePerDay: '',
    optionIds: [],
    link: '',
    notes: '',
  };
}

function rentalOptions(selected) {
  return ofCurrentTravel(state.rentals)
    .map(
      (r) =>
        `<option value="${r.id}" ${selected === r.id ? 'selected' : ''}>${escapeHtml(rentalLabel(r))}</option>`,
    )
    .join('');
}

function offerForm(p) {
  const days = rentalDays(offerRental(p));
  return /* HTML */ `
    <h3>${p.id ? 'Modifier' : 'Ajouter'} un véhicule</h3>
    <div class="field-row">
      <div class="field">
        <label>Location</label>
        <select id="car-rental" onchange="repaintOfferRental()">
          ${rentalOptions(p.rentalId)}
        </select>
      </div>
      <div class="field">
        <label>Statut</label>
        <select id="car-status">
          <option value="" ${p.status ? '' : 'selected'}>
            ${UNSET_CAR_STATUS.emoji} ${UNSET_CAR_STATUS.label}
          </option>
          ${wordOptions(CAR_STATUSES, p.status)}
        </select>
      </div>
    </div>
    <div class="field">
      <label>Modèle</label>
      <select id="car-model">
        <option value="" ${p.modelId ? '' : 'selected'}>
          ${escapeHtml(p.model) || 'Aucun modèle'}
        </option>
        ${travelCarModels()
          .map(
            (m) =>
              `<option value="${m.id}" ${p.modelId === m.id ? 'selected' : ''}>${escapeHtml(m.name)}</option>`,
          )
          .join('')}
      </select>
    </div>
    ${offerOptionsField(p)}
    <div class="field">
      <label>Prix total ${days ? `pour ${days} jours` : ''}</label
      ><input
        id="car-price-total"
        type="text"
        value="${escapeHtml(p.priceTotal)}"
        placeholder="420"
      />
    </div>
    <div class="field">
      <label>Lien</label><input id="car-link" type="text" value="${escapeHtml(p.link)}" />
    </div>
    <div class="field">
      <label>Notes</label><textarea id="car-notes" rows="2">${escapeHtml(p.notes)}</textarea>
    </div>
    <div class="modal-actions">
      <button class="btn btn-ghost" onclick="dismissModal()">Annuler</button>
      <button class="btn" id="f-save" onclick="saveOffer('${p.id || ''}')">Enregistrer</button>
    </div>
  `;
}

// Les options sont celles du loueur de la location : en changer change le catalogue proposé.
function repaintOfferRental() {
  modal.payload.rentalId = document.getElementById('car-rental').value;
  modal.payload.optionIds = [];
  repaintOfferOptions();
}
