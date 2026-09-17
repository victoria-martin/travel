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

/*
  Une option retirée du catalogue quitte les offres et les scénarios qui l'avaient cochée : sans ça
  leur `optionIds` garderait une référence morte, que les totaux écarteraient en silence.
*/
function saveProvider(id) {
  const provider = readProviderForm(id);
  forgetProviderOptions(removedOptionIds(id ? getProvider(id) : null, provider));
  upsertProvider(provider);
  closeModal();
}

function removedOptionIds(before, after) {
  const kept = new Set(after.options.map((option) => option.id));
  return ((before && before.options) || [])
    .map((option) => option.id)
    .filter((optionId) => !kept.has(optionId));
}

function forgetProviderOptions(optionIds) {
  if (!optionIds.length) return;
  const without = (ids) => (ids || []).filter((id) => !optionIds.includes(id));
  state.offers.forEach((offer) => (offer.optionIds = without(offer.optionIds)));
  state.scenarios.forEach((s) => (s.offerOptionIds = without(s.offerOptionIds)));
}

// Créé depuis un trajet ou une voiture, un prestataire ne porte que son nom et son mode : le
// reste se complète dans l'onglet.
function createProviderNamed(name, mode) {
  const item = { ...emptyProvider(), id: uid(), travelId: currentTravelId(), name, mode };
  upsertProvider(item);
  return item;
}
