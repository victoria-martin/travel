function upsertProvider(item) {
  const idx = state.providers.findIndex((p) => p.id === item.id);
  if (idx === -1) state.providers.push(item);
  else state.providers[idx] = item;
  saveNow();
}

// Une ligne d'option laissée vide n'est pas une option : elle ne s'enregistre pas.
function readProviderForm(id) {
  return {
    id: id || uid(),
    travelId: currentTravelId(),
    mode: document.getElementById('prov-mode').value,
    name: document.getElementById('prov-name').value.trim(),
    logo: document.getElementById('prov-logo').value.trim(),
    site: document.getElementById('prov-site').value.trim(),
    bookingUrl: document.getElementById('prov-booking').value.trim(),
    notes: document.getElementById('prov-notes').value.trim(),
    options: modal.payload.options.filter((option) => option.label || option.amount),
    modelIds: modal.payload.modelIds || [],
  };
}

function saveProvider(id) {
  upsertProvider(readProviderForm(id));
  closeModal();
}

// Créé depuis un trajet ou une voiture, un prestataire ne porte que son nom et son mode : le
// reste se complète dans l'onglet.
function createProviderNamed(name, mode) {
  const item = { ...emptyProvider(), id: uid(), travelId: currentTravelId(), name, mode };
  upsertProvider(item);
  return item;
}
