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

// body : React (src/domains/rentals/modal/OfferModal.tsx, src/modal-bodies.ts).

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
      <button type="button" class="btn btn-secondary btn-small" onclick="addOfferModelNamed()">
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
