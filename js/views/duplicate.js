function duplicateAccommodation(id) {
  const a = getAccommodation(id);
  state.accommodations.push({ ...a, id: uid(), name: `${a.name} (copie)`, tags: [...a.tags] });
  saveNow();
  render();
}

function duplicateCar(id) {
  const car = getCar(id);
  state.cars.push({ ...car, id: uid(), model: `${car.model} (copie)`, isDefault: false });
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

// La copie s'insère sous l'originale : on ajuste l'une des deux, ou on en masque une. Elle ne
// partage rien avec elle — ses lignes sont les siennes, donc elles reprennent des identifiants
// neufs. Sa colonne, en revanche, reste celle de l'originale : on y ajoute une étape.
function copyStep(step) {
  return {
    ...step,
    id: uid(),
    extras: holderExtras(step).map((line) => ({ ...line, id: uid() })),
  };
}

function duplicateStep(scenarioId, stepId) {
  const s = getScenario(scenarioId);
  const i = s.steps.findIndex((st) => st.id === stepId);
  s.steps.splice(i + 1, 0, copyStep(s.steps[i]));
  saveNow();
  render();
}

// Groupes et colonnes reprennent aussi des identifiants neufs, et les étapes de la copie désignent
// les siens : deux scénarios qui partageraient une colonne se choisiraient l'un l'autre.
function duplicateScenario(id) {
  const s = getScenario(id);
  const copy = JSON.parse(JSON.stringify(s));
  copy.id = uid();
  copy.name = s.name + ' (copie)';
  copy.isChosen = false;
  const renamed = {};
  scenarioGroups(copy).forEach((group) => {
    renamed[group.id] = uid();
    group.id = renamed[group.id];
    group.extras = holderExtras(group).map((line) => ({ ...line, id: uid() }));
    groupOptions(group).forEach((option) => {
      renamed[option.id] = uid();
      option.id = renamed[option.id];
    });
  });
  copy.steps = copy.steps.map((step) => ({
    ...copyStep(step),
    groupId: renamed[step.groupId] || '',
    optionId: renamed[step.optionId] || '',
  }));
  state.scenarios.push(copy);
  saveNow();
  render();
}
