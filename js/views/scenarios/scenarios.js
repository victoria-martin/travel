function renderScenariosView() {
  return /* HTML */ `
    ${scenariosHeader()}
    ${
      state.scenarios.length === 0
        ? emptyState('Aucun scénario', 'Crée un premier scénario pour poser tes étapes.')
        : scenarioList(state.scenarios)
    }
  `;
}

function createScenario() {
  const s = { id: uid(), name: 'Nouveau scénario', steps: [] };
  state.scenarios.push(s);
  saveNow();
  openScenario(s.id);
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

function openScenario(id) {
  activeScenarioId = id;
  view = 'scenario-detail';
  render();
}
