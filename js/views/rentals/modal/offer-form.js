function emptyOffer() {
  return {
    id: null,
    providerId: '',
    modelId: '',
    status: '',
    model: '',
    location: '',
    pickupDate: '',
    pickupTime: '',
    dropoffDate: '',
    dropoffTime: '',
    pricePerDay: '',
    optionIds: [],
    link: '',
    notes: '',
  };
}

function offerForm(p) {
  return /* HTML */ `
    <h3>${p.id ? 'Modifier' : 'Ajouter'} une offre</h3>
    <div class="field-row">
      ${providerSelectField('offer-provider', 'car', p.providerId, repaintOfferProvider)}
      <div class="field">
        <label>Statut</label>
        <select id="offer-status">
          <option value="" ${p.status ? '' : 'selected'}>
            ${UNSET_CAR_STATUS.emoji} ${UNSET_CAR_STATUS.label}
          </option>
          ${wordOptions(CAR_STATUSES, p.status)}
        </select>
      </div>
    </div>
    <div class="field">
      <label>Modèle</label>
      <div id="offer-model-field">${offerModelSelect(p)}</div>
    </div>
    <div class="field">
      <label>Lieu de prise en charge</label
      ><input
        id="offer-location"
        type="text"
        value="${escapeHtml(p.location)}"
      />
    </div>
    ${offerScheduleFields('pickup', 'Prise en charge', p.pickupDate, p.pickupTime)}
    ${offerScheduleFields('dropoff', 'Restitution', p.dropoffDate, p.dropoffTime)}
    ${offerOptionsField(p)}
    <div class="field">
      <label>Prix par jour</label
      ><input
        id="offer-price-day"
        type="text"
        value="${escapeHtml(p.pricePerDay)}"
      />
    </div>
    <div class="field">
      <label>Lien</label><input id="offer-link" type="text" value="${escapeHtml(p.link)}" />
    </div>
    <div class="field">
      <label>Notes</label><textarea id="offer-notes" rows="2">${escapeHtml(p.notes)}</textarea>
    </div>
    <div class="modal-actions">
      <button class="btn btn-ghost" onclick="dismissModal()">Annuler</button>
      <button class="btn" id="f-save" onclick="saveOffer('${p.id || ''}')">Enregistrer</button>
    </div>
  `;
}

// Les dates disent sur quelle durée le tarif relevé valait : un loueur est dégressif, deux relevés
// de durées différentes ne donnent pas le même prix par jour.
function offerScheduleFields(side, label, date, time) {
  return /* HTML */ `<div class="field-row">
    <div class="field">
      <label>${label}</label
      ><input id="offer-${side}-date" type="date" value="${escapeHtml(date)}" />
    </div>
    <div class="field">
      <label>Heure</label><input id="offer-${side}-time" type="time" value="${escapeHtml(time)}" />
    </div>
  </div>`;
}

/*
  Les modèles proposés sont ceux du loueur, pas tout le catalogue du voyage ; celui que l'offre
  porte déjà y reste même si le loueur ne le coche plus — le menu ne fait pas disparaître une
  valeur enregistrée. Celui qui manque se tape ici, comme une option se tape sous son loueur.
*/
function offerModelSelect(p) {
  const models = providerCarModels(p.providerId);
  const current = getCarModel(p.modelId);
  if (current && !models.includes(current)) models.push(current);
  return /* HTML */ `<select id="offer-model" onchange="setOfferModel()">
      <option value="" ${p.modelId ? '' : 'selected'}>
        ${escapeHtml(p.model) || 'Aucun modèle'}
      </option>
      ${models
        .map(
          (m) =>
            `<option value="${m.id}" ${p.modelId === m.id ? 'selected' : ''}>${escapeHtml(m.name)}</option>`,
        )
        .join('')}
    </select>
    <div class="provider-option-row">
      <input id="offer-model-name" type="text" placeholder="Nouveau modèle" />
      <button type="button" class="btn btn-small" onclick="addOfferModelNamed()">
        ${svgIcon('plus')}
      </button>
    </div>`;
}

function setOfferModel() {
  modal.payload.modelId = document.getElementById('offer-model').value;
}

// Le modèle tapé rejoint le catalogue du voyage et se choisit : le loueur le proposera puisqu'on
// l'aura relevé chez lui.
function addOfferModelNamed() {
  const name = document.getElementById('offer-model-name').value.trim();
  if (!name) return;
  modal.payload.modelId = createCarModelNamed(name, '', '').id;
  repaintOfferModel();
}

// Le loueur décide des modèles ET des options : en changer repeint les deux.
function repaintOfferProvider() {
  modal.payload.providerId = document.getElementById('offer-provider').value;
  modal.payload.optionIds = [];
  repaintOfferModel();
  repaintOfferOptions();
}

function repaintOfferModel() {
  document.getElementById('offer-model-field').innerHTML = offerModelSelect(modal.payload);
}
