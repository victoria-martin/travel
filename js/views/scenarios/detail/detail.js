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
        ${stepList(s)} ${scenarioCarBlock(s)} ${scenarioTotalBlock(s)} ${scenarioRecap(s)}
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

function setStepBudget(scenarioId, stepId, budget) {
  getStep(scenarioId, stepId).budget = budget.trim();
  saveNow();
  render();
}

// Une étape se rattache soit à une ville, soit à un hébergement : le même select porte les deux.
function setStepPlace(scenarioId, stepId, value) {
  const s = getScenario(scenarioId);
  const st = s.steps.find((x) => x.id === stepId);
  const [kind, placeId] = value.split(':');
  st.cityId = kind === 'ville' ? placeId : null;
  st.accommodationId = kind === 'heb' ? placeId : null;
  saveNow();
  render();
}
