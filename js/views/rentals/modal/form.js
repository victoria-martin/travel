function emptyCar() {
  return {
    id: null,
    rentalId: '',
    status: '',
    model: '',
    fuel: '',
    gearbox: '',
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

function carForm(p) {
  const rental = vehicleRental(p);
  return /* HTML */ `
    <h3>${p.id ? 'Modifier' : 'Ajouter'} un véhicule</h3>
    <div class="field">
      <label>Location</label>
      <select id="car-rental" onchange="repaintVehicleRental()">
        ${rentalOptions(p.rentalId)}
      </select>
    </div>
    <div class="field-row">
      <div class="field">
        <label>Modèle</label
        ><input id="car-model" type="text" value="${escapeHtml(p.model)}" placeholder="Fiat 500" />
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
    <div class="field-row">
      <div class="field">
        <label>Motorisation</label>
        <select id="car-fuel">
          <option value="" ${p.fuel ? '' : 'selected'}>
            ${UNSET_CAR_FUEL.emoji} ${UNSET_CAR_FUEL.label}
          </option>
          ${wordOptions(CAR_FUELS, p.fuel)}
        </select>
      </div>
      <div class="field">
        <label>Boîte</label>
        <select id="car-gearbox">
          <option value="" ${p.gearbox ? '' : 'selected'}>
            ${UNSET_CAR_GEARBOX.emoji} ${UNSET_CAR_GEARBOX.label}
          </option>
          ${wordOptions(CAR_GEARBOXES, p.gearbox)}
        </select>
      </div>
    </div>
    <div class="field">
      <label>Prix total ${rentalDays(rental) ? `pour ${rentalDays(rental)} jours` : ''}</label
      ><input
        id="car-price-total"
        type="text"
        value="${escapeHtml(p.priceTotal)}"
        placeholder="420"
      />
    </div>
    ${vehicleOptionsField(p)}
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

// Changer de location change de loueur, donc de catalogue d'options : le bloc se repeint.
function repaintVehicleRental() {
  modal.payload.rentalId = document.getElementById('car-rental').value;
  modal.payload.optionIds = [];
  repaintVehicleOptions();
}
