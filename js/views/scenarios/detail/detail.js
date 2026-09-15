function renderScenarioDetailView() {
  const s = getScenario(activeScenarioId);
  if (!s) {
    view = 'scenarios';
    return renderScenariosView();
  }
  if (s.steps.length === 0) {
    return (
      scenarioDetailHeader(s) +
      emptyState('Aucune étape', 'Ajoute une première étape à ce scénario.') +
      stepAppendRow(s)
    );
  }
  // laisser ce comm TEST
  // on a enlevé scenarioRouteTrails temportairement
  // ${scenarioDetailHeader(s)} ${scenarioRouteTrail(s)}
  // sous <div class="scenario-detail-cols"> pour à gauche et au dessus pr dessus
  return /* HTML */ `
    ${scenarioDetailHeader(s)} ${trailShown() ? scenarioRouteTrail(s) + scenarioRouteStrip(s) : ''}
    <div class="scenario-detail-cols">
      <div class="scenario-detail-main view-scroller">
        ${stepList(s)}
        <div class="scenario-detail-money">
          ${scenarioCarBlock(s)} ${scenarioExpensesBlock(s)} ${scenarioTotalBlock(s)}
        </div>
      </div>
      ${prefs.scenarioSidePanel ? scenarioSidePanel(s) : ''}
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

function insertStep(scenarioId, index) {
  openInlineMenu = null;
  getScenario(scenarioId).steps.splice(index, 0, { ...emptyStep(), id: uid() });
  saveNow();
  render();
}

// Une étape neuve naît dans la colonne d'où le ＋ a été cliqué.
function insertOptionStep(scenarioId, index, optionId) {
  const scenario = getScenario(scenarioId);
  const sibling = scenario.steps.find((st) => st.optionId === optionId);
  scenario.steps.splice(index, 0, {
    ...emptyStep(),
    id: uid(),
    groupId: sibling.groupId,
    optionId,
  });
  saveNow();
  render();
}

function insertStepGroup(scenarioId, index) {
  const step = { ...emptyStep(), id: uid() };
  getScenario(scenarioId).steps.splice(index, 0, step);
  makeStepGroup(scenarioId, step.id);
}

// Une étape déposée prend la colonne de la carte visée : c'est ainsi qu'elle entre dans un groupe,
// et qu'elle en sort en tombant sur une étape ordinaire.
function moveStepBefore(scenarioId, stepId, targetId, before) {
  if (stepId === targetId) return;
  const s = getScenario(scenarioId);
  const step = s.steps.find((st) => st.id === stepId);
  const target = s.steps.find((st) => st.id === targetId);
  if (!step || !target) return;
  const [wasGroup, wasOption] = [step.groupId, step.optionId];
  s.steps = s.steps.filter((st) => st.id !== stepId);
  const at = s.steps.findIndex((x) => x.id === targetId);
  step.groupId = target.groupId;
  step.optionId = target.optionId;
  s.steps.splice(before ? at : at + 1, 0, step);
  if (wasOption !== step.optionId) pruneEmptyOption(s, wasGroup, wasOption);
  saveNow();
  render();
}

function toggleStepHidden(scenarioId, stepId) {
  const step = getStep(scenarioId, stepId);
  step.hidden = !step.hidden;
  saveNow();
  render();
}

/*
  Supprimer la dernière étape d'une colonne retire la colonne : une colonne sans étape ne
  proposerait rien. Le groupe qui n'a plus qu'une colonne se défait, comme au retrait d'une colonne.
*/
function deleteStep(scenarioId, stepId) {
  const scenario = getScenario(scenarioId);
  const step = getStep(scenarioId, stepId);
  scenario.steps = scenario.steps.filter((st) => st.id !== stepId);
  pruneEmptyOption(scenario, step.groupId, step.optionId);
  saveNow();
  render();
}
