function renderScenarioDetailView() {
  const s = getScenario(activeScenarioId);
  if (!s) {
    view = 'scenarios';
    return renderScenariosView();
  }
  return /* HTML */ `
    ${scenarioDetailHeader(s)}
    ${
      s.steps.length === 0
        ? emptyState('Aucune étape', 'Ajoute une première étape à ce scénario.')
        : stepList(s) + scenarioRecap(s)
    }
  `;
}

function renameScenario(id, name) {
  const s = getScenario(id);
  s.name = name.trim() || s.name;
  saveNow();
}

function moveStep(scenarioId, stepId, dir) {
  const s = getScenario(scenarioId);
  const i = s.steps.findIndex((st) => st.id === stepId);
  const j = i + dir;
  if (j < 0 || j >= s.steps.length) return;
  [s.steps[i], s.steps[j]] = [s.steps[j], s.steps[i]];
  saveNow();
  render();
}

function deleteStep(scenarioId, stepId) {
  const s = getScenario(scenarioId);
  s.steps = s.steps.filter((st) => st.id !== stepId);
  saveNow();
  render();
}

function setStepNights(scenarioId, stepId, nights) {
  const s = getScenario(scenarioId);
  const st = s.steps.find((x) => x.id === stepId);
  st.nights = parseInt(nights) || 0;
  saveNow();
  render();
}

function setStepAccommodation(scenarioId, stepId, accId) {
  const s = getScenario(scenarioId);
  const st = s.steps.find((x) => x.id === stepId);
  st.accommodationId = accId || null;
  saveNow();
}
