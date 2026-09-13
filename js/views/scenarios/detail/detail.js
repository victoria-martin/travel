function renderScenarioDetailView() {
  const s = getScenario(activeScenarioId);
  if (!s) {
    view = 'scenarios';
    return renderScenariosView();
  }
  if (s.steps.length === 0) {
    return (
      scenarioDetailHeader(s) +
      emptyState('Aucune étape', 'Ajoute une première étape à ce scénario.')
    );
  }
  return /* HTML */ `
    ${scenarioDetailHeader(s)}
    <div class="scenario-detail-cols">
      <div class="scenario-detail-main">
        ${stepList(s)} ${scenarioCarBlock(s)} ${scenarioExpensesBlock(s)} ${scenarioTotalBlock(s)}
      </div>
      ${
        prefs.showScenarioMap
          ? /* HTML */ `<aside class="scenario-detail-side">${scenarioMapBlock(s)}</aside>`
          : ''
      }
    </div>
  `;
}

function renameScenario(id, name) {
  const s = getScenario(id);
  s.name = name.trim() || s.name;
  saveNow();
}

function renameStep(scenarioId, stepId, city) {
  const step = getStep(scenarioId, stepId);
  step.city = city.trim() || step.city;
  saveNow();
  syncEditable(`step:${stepId}:city`, step.city);
}

function insertStep(scenarioId, index, optionCount) {
  openInlineMenu = null;
  const s = getScenario(scenarioId);
  s.steps.splice(index, 0, { ...emptyStep(optionCount), id: uid() });
  saveNow();
  render();
}

function moveStepBefore(scenarioId, stepId, targetId, before) {
  if (stepId === targetId) return;
  const s = getScenario(scenarioId);
  const step = s.steps.find((st) => st.id === stepId);
  if (!step) return;
  s.steps = s.steps.filter((st) => st.id !== stepId);
  const at = s.steps.findIndex((st) => st.id === targetId);
  s.steps.splice(before ? at : at + 1, 0, step);
  saveNow();
  render();
}

function toggleStepHidden(scenarioId, stepId) {
  const step = getStep(scenarioId, stepId);
  step.hidden = !step.hidden;
  saveNow();
  render();
}

function deleteStep(scenarioId, stepId) {
  const s = getScenario(scenarioId);
  s.steps = s.steps.filter((st) => st.id !== stepId);
  saveNow();
  render();
}

// La recherche reste ouverte après un ajout : on attache souvent plusieurs attractions d'affilée.
function attachStepAttraction(scenarioId, stepId, attractionId) {
  const step = getStep(scenarioId, stepId);
  if (!step.attractions) step.attractions = [];
  step.attractions.push({ id: uid(), attractionId, count: 1, budget: '' });
  saveNow();
  render();
  focusStepAttractionSearch(stepId);
}

function setStepAttraction(scenarioId, stepId, index, attractionId) {
  getStep(scenarioId, stepId).attractions[index].attractionId = attractionId;
  saveNow();
  render();
}

function detachStepAttraction(scenarioId, stepId, index) {
  openInlineMenu = null;
  getStep(scenarioId, stepId).attractions.splice(index, 1);
  saveNow();
  render();
}

function setStepAttractionCount(scenarioId, stepId, index, count) {
  getStep(scenarioId, stepId).attractions[index].count = parseInt(count) || 1;
  saveNow();
  render();
}

function setStepAttractionBudget(scenarioId, stepId, index, budget) {
  getStep(scenarioId, stepId).attractions[index].budget = budget.trim();
  saveNow();
  render();
}
