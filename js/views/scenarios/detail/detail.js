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

function renameStep(scenarioId, stepId, name) {
  const step = getStep(scenarioId, stepId);
  step.name = name.trim() || step.name;
  saveNow();
  syncEditable(`step:${stepId}:name`, step.name);
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
