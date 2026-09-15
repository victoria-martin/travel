/*
  La grille de saisie : on recopie la liste du loueur véhicule par véhicule, Entrée enregistre la
  ligne et en rouvre une vide. Elle ne demande que ce que la liste affiche — modèle, motorisation,
  boîte, prix total ; le statut, les options et le reste se posent ensuite depuis la fiche.
  Une seule location a sa ligne ouverte à la fois : c'est celle où l'on tape.
*/
let draftRentalId = null;

function startVehicleDraft(rentalId) {
  draftRentalId = rentalId;
  render();
  focusVehicleDraft();
}

function closeVehicleDraft() {
  draftRentalId = null;
  render();
}

function focusVehicleDraft() {
  const field = document.getElementById('draft-model');
  if (field) field.focus();
}

function vehicleDraftRow(rentalId) {
  if (draftRentalId !== rentalId)
    return /* HTML */ `<button class="vehicle-add" onclick="startVehicleDraft('${rentalId}')">
      ＋ Ajouter un véhicule
    </button>`;
  return /* HTML */ `<div class="vehicle-row vehicle-draft" onkeydown="vehicleDraftKeydown(event)">
    <input id="draft-model" type="text" placeholder="Fiat 500" />
    <select id="draft-fuel">
      <option value="">⛽ Motorisation</option>
      ${wordOptions(CAR_FUELS)}
    </select>
    <select id="draft-gearbox">
      <option value="">⚙️ Boîte</option>
      ${wordOptions(CAR_GEARBOXES)}
    </select>
    <input id="draft-price" type="text" placeholder="420 € au total" />
    <button class="btn btn-small" onclick="saveVehicleDraft()">✓</button>
    <button class="icon-btn" onclick="closeVehicleDraft()" title="Fermer">✕</button>
  </div>`;
}

function vehicleDraftKeydown(event) {
  if (event.key !== 'Enter' && event.key !== 'Escape') return;
  event.preventDefault();
  if (event.key === 'Escape') return closeVehicleDraft();
  saveVehicleDraft();
}

// Une ligne sans modèle n'est pas un véhicule : elle ferme la saisie plutôt que d'enregistrer.
function saveVehicleDraft() {
  const model = document.getElementById('draft-model').value.trim();
  if (!model) return closeVehicleDraft();
  state.cars.push({
    ...emptyCar(),
    id: uid(),
    travelId: currentTravelId(),
    rentalId: draftRentalId,
    model,
    fuel: document.getElementById('draft-fuel').value,
    gearbox: document.getElementById('draft-gearbox').value,
    priceTotal: document.getElementById('draft-price').value.trim(),
  });
  saveNow();
  render();
  focusVehicleDraft();
}
