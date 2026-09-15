/*
  La grille de saisie : on recopie la liste du loueur véhicule par véhicule, Entrée enregistre la
  ligne et en rouvre une vide. Elle ne demande que ce que la liste affiche — modèle, motorisation,
  boîte, et les deux prix que le loueur annonce ; le statut, les options et le reste se posent
  ensuite depuis la fiche.
  Le modèle tapé rejoint le catalogue du voyage, celui de l'onglet Voitures, et le loueur de la
  location : on le retrouve au menu de la prochaine offre prise chez lui. Une seule location a sa
  ligne ouverte à la fois : c'est celle où l'on tape.
*/
let draftRentalId = null;

function startOfferDraft(rentalId) {
  draftRentalId = rentalId;
  render();
  focusOfferDraft();
}

function closeOfferDraft() {
  draftRentalId = null;
  render();
}

function focusOfferDraft() {
  const field = document.getElementById('draft-model');
  if (field) field.focus();
}

function offerDraftRow(rentalId) {
  if (draftRentalId !== rentalId)
    return /* HTML */ `<button class="rental-offer-add" onclick="startOfferDraft('${rentalId}')">
      ${svgIcon('plus')} Ajouter un véhicule
    </button>`;
  return /* HTML */ `<div
    class="rental-offer rental-offer-draft"
    onkeydown="offerDraftKeydown(event)"
  >
    <input id="draft-model" type="text" placeholder="Golf" list="draft-models" />
    <datalist id="draft-models">
      ${providerCarModels(getRental(rentalId).providerId)
        .map((model) => `<option value="${escapeHtml(model.name)}"></option>`)
        .join('')}
    </datalist>
    <select id="draft-fuel">
      <option value="">${UNSET_CAR_FUEL.emoji} Motorisation</option>
      ${wordOptions(CAR_FUELS)}
    </select>
    <select id="draft-gearbox">
      <option value="">${UNSET_CAR_GEARBOX.emoji} Boîte</option>
      ${wordOptions(CAR_GEARBOXES)}
    </select>
    <input id="draft-price" type="text" placeholder="420 € au total" />
    <input id="draft-price-day" type="text" placeholder="42 € / jour" />
    <button class="btn btn-small" onclick="saveOfferDraft()">${svgIcon('check')}</button>
    <button class="icon-btn" onclick="closeOfferDraft()" title="Fermer">${svgIcon('x')}</button>
  </div>`;
}

function offerDraftKeydown(event) {
  if (event.key !== 'Enter' && event.key !== 'Escape') return;
  event.preventDefault();
  if (event.key === 'Escape') return closeOfferDraft();
  saveOfferDraft();
}

// Une ligne sans modèle n'est pas un véhicule : elle ferme la saisie plutôt que d'enregistrer.
function saveOfferDraft() {
  const name = document.getElementById('draft-model').value.trim();
  if (!name) return closeOfferDraft();
  const model = createCarModelNamed(
    name,
    document.getElementById('draft-fuel').value,
    document.getElementById('draft-gearbox').value,
  );
  addProviderModel(getRental(draftRentalId).providerId, model.id);
  state.offers.push({
    ...emptyOffer(),
    id: uid(),
    travelId: currentTravelId(),
    rentalId: draftRentalId,
    modelId: model.id,
    priceTotal: document.getElementById('draft-price').value.trim(),
    pricePerDay: document.getElementById('draft-price-day').value.trim(),
  });
  saveNow();
  render();
  focusOfferDraft();
}
