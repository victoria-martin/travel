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

function duplicateTransport(id) {
  const t = getTransport(id);
  state.transports.push({ ...t, id: uid() });
  saveNow();
  render();
}

// La copie s'insère sous l'originale : on ajuste l'une des deux, ou on en masque une.
// Une copie d'étape ne partage rien avec l'originale : ses options et ses activités sont des
// lignes à elles, donc elles reprennent des identifiants neufs.
function copyStep(step) {
  const newOptionId = {};
  const options = stepOptions(step).map((option) => {
    newOptionId[option.id] = uid();
    return { ...option, id: newOptionId[option.id] };
  });
  return {
    ...step,
    id: uid(),
    options,
    extras: stepExtras(step).map((line) => ({
      ...line,
      id: uid(),
      optionId: newOptionId[line.optionId] || '',
    })),
  };
}

function duplicateStep(scenarioId, stepId) {
  const s = getScenario(scenarioId);
  const i = s.steps.findIndex((st) => st.id === stepId);
  s.steps.splice(i + 1, 0, copyStep(s.steps[i]));
  saveNow();
  render();
}

function duplicateScenario(id) {
  const s = getScenario(id);
  const copy = JSON.parse(JSON.stringify(s));
  copy.id = uid();
  copy.name = s.name + ' (copie)';
  copy.steps = copy.steps.map(copyStep);
  state.scenarios.push(copy);
  saveNow();
  render();
}
