function duplicateAccommodation(id) {
  const a = getAccommodation(id);
  state.accommodations.push({ ...a, id: uid(), name: `${a.name} (copie)`, tags: [...a.tags] });
  saveNow();
  render();
}

function duplicateCar(id) {
  const car = getCar(id);
  state.cars.push({ ...car, id: uid(), name: `${car.name} (copie)`, isDefault: false });
  saveNow();
  render();
}

function duplicateFixedCost(id) {
  const cost = getFixedCost(id);
  state.fixedCosts.push({ ...cost, id: uid(), label: `${cost.label} (copie)` });
  saveNow();
  render();
}

function duplicateCity(id) {
  const city = getCity(id);
  state.cities.push({ ...city, id: uid(), name: `${city.name} (copie)` });
  saveNow();
  render();
}

function duplicateAttraction(id) {
  const a = getAttraction(id);
  state.attractions.push({ ...a, id: uid(), name: `${a.name} (copie)`, tags: [...a.tags] });
  saveNow();
  render();
}

function duplicateScenario(id) {
  const s = getScenario(id);
  const copy = JSON.parse(JSON.stringify(s));
  copy.id = uid();
  copy.name = s.name + ' (copie)';
  copy.steps.forEach((st) => (st.id = uid()));
  state.scenarios.push(copy);
  saveNow();
  render();
}
