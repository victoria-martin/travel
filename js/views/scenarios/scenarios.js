let activeScenarioId = null;

function renderScenariosView() {
  const items = ofCurrentTravel(state.scenarios).sort(
    (a, b) => (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0),
  );
  return /* HTML */ `
    ${scenariosHeader()}
    ${
      items.length === 0
        ? emptyState('Aucun scénario', 'Crée un premier scénario pour poser tes étapes.')
        : scenarioList(items)
    }
  `;
}

function toggleScenarioFavorite(id) {
  const s = getScenario(id);
  s.favorite = !s.favorite;
  saveNow();
  render();
}

function createScenario() {
  const s = {
    id: uid(),
    travelId: currentTravelId(),
    name: 'Nouveau scénario',
    startDate: '',
    carId: defaultCar()?.id || null,
    costIds: [],
    favorite: false,
    steps: [],
  };
  state.scenarios.push(s);
  saveNow();
  openScenario(s.id);
}

function openScenario(id) {
  activeScenarioId = id;
  view = 'scenario-detail';
  render();
}
