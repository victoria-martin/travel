function upsertCarModel(item) {
  const idx = state.carModels.findIndex((m) => m.id === item.id);
  if (idx === -1) state.carModels.push(item);
  else state.carModels[idx] = item;
  saveNow();
}

function saveCarModel(id) {
  const model = {
    id: id || uid(),
    travelId: currentTravelId(),
    name: document.getElementById('model-name').value.trim(),
    fuel: carFuelKey(document.getElementById('model-fuel').value),
    gearbox: carGearboxKey(document.getElementById('model-gearbox').value),
    consumption: document.getElementById('model-consumption').value.trim(),
  };
  linkCarModelProviders(model.id, modal.payload.providerIds || []);
  upsertCarModel(model);
  closeModal();
}

// La relation s'écrit là où elle vit : dans les `modelIds` de chaque loueur, coché ou décoché.
function linkCarModelProviders(modelId, providerIds) {
  providersOfMode('car').forEach((provider) => {
    const others = (provider.modelIds || []).filter((id) => id !== modelId);
    provider.modelIds = providerIds.includes(provider.id) ? others.concat(modelId) : others;
  });
}

// Un modèle tapé en relevant une offre rejoint le catalogue : on ne quitte pas la saisie pour ça.
// Motorisation, boîte et consommation absentes se complètent depuis le catalogue ADEME.
function createCarModelNamed(name, fuel, gearbox) {
  const suggestion = lookupCarConsumption(name) || {};
  fuel = fuel || suggestion.fuel || '';
  gearbox = gearbox || suggestion.gearbox || '';
  const existing = findCarModelNamed(name);
  if (existing) {
    existing.fuel = existing.fuel || fuel;
    existing.gearbox = existing.gearbox || gearbox;
    existing.consumption = existing.consumption || suggestion.consumption || '';
    upsertCarModel(existing);
    return existing;
  }
  const model = {
    ...emptyCarModel(),
    id: uid(),
    travelId: currentTravelId(),
    name,
    fuel,
    gearbox,
    consumption: suggestion.consumption || '',
  };
  upsertCarModel(model);
  return model;
}
