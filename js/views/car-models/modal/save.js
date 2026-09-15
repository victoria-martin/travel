function upsertCarModel(item) {
  const idx = state.carModels.findIndex((m) => m.id === item.id);
  if (idx === -1) state.carModels.push(item);
  else state.carModels[idx] = item;
  saveNow();
}

function saveCarModel(id) {
  upsertCarModel({
    id: id || uid(),
    travelId: currentTravelId(),
    name: document.getElementById('model-name').value.trim(),
    fuel: carFuelKey(document.getElementById('model-fuel').value),
    gearbox: carGearboxKey(document.getElementById('model-gearbox').value),
  });
  closeModal();
}

// Un modèle tapé dans une location rejoint le catalogue : on ne quitte pas la ligne pour ça.
function createCarModelNamed(name, fuel, gearbox) {
  const existing = findCarModelNamed(name);
  if (existing) {
    existing.fuel = existing.fuel || fuel;
    existing.gearbox = existing.gearbox || gearbox;
    upsertCarModel(existing);
    return existing;
  }
  const model = { ...emptyCarModel(), id: uid(), travelId: currentTravelId(), name, fuel, gearbox };
  upsertCarModel(model);
  return model;
}
