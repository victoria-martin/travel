let activeScenarioId = null;

function renderScenariosView() {
  const items = archivedScenarios(ofCurrentTravel(state.scenarios)).sort(
    (a, b) => scenarioRank(a) - scenarioRank(b),
  );
  return /* HTML */ `
    ${scenariosHeader()}
    ${
      items.length === 0
        ? showArchivedScenarios
          ? emptyState('Aucun scénario archivé', 'Archive un scénario pour le sortir de la liste.')
          : emptyState('Aucun scénario', 'Crée un premier scénario pour poser tes étapes.')
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

// Ce que porte un scénario neuf, avant qu'on lui donne des étapes : le bouton Scénarios l'ouvre
// tout de suite, l'import d'itinéraire depuis la carte (route-accommodation-modal.js) le peuple
// d'abord.
function blankScenario() {
  const offer = defaultOffer();
  return {
    id: uid(),
    travelId: currentTravelId(),
    name: 'Nouveau scénario',
    startDate: currentTravel()?.startDate || '',
    offerId: offer?.id || null,
    offerOptionIds: [...(offer?.optionIds || [])],
    costIds: [],
    transportIds: [],
    favorite: false,
    archived: false,
    steps: [],
  };
}

function createScenario() {
  const s = blankScenario();
  state.scenarios.push(s);
  saveNow();
  showToast('Scénario créé');
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
