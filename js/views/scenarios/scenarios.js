let activeScenarioId = null;

function renderScenariosView() {
  const items = ofCurrentTravel(state.scenarios).sort((a, b) => scenarioRank(a) - scenarioRank(b));
  return /* HTML */ `
    ${scenariosHeader()}
    ${
      items.length === 0
        ? emptyState('Aucun scénario', 'Crée un premier scénario pour poser tes étapes.')
        : scenarioList(items) + (compareMode ? scenarioCompare(items) : '')
    }
  `;
}

// Le scénario retenu ouvre la liste, les favoris le suivent : on lit d'abord ce qui est décidé.
function scenarioRank(s) {
  return s.isChosen ? 0 : s.favorite ? 1 : 2;
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
    startDate: currentTravel()?.startDate || '',
    carId: defaultCar()?.id || null,
    costIds: [],
    transportIds: [],
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
  showRoute();
}

// A scenario named TEST is the one being worked on: the app opens straight on its detail.
const TEST_SCENARIO_NAME = 'TEST_NO';

function selectTestScenario() {
  const test = ofCurrentTravel(state.scenarios).find(
    (s) => (s.name || '').trim().toUpperCase() === TEST_SCENARIO_NAME,
  );
  if (!test) return;
  activeScenarioId = test.id;
  view = 'scenario-detail';
}
