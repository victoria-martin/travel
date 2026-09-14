// Reordering a step by clicking, one rank at a time, under the handle that drags it further.
function stepMoveButtons(scenario, step) {
  const at = scenario.steps.findIndex((st) => st.id === step.id);
  return /* HTML */ `
    <button
      class="icon-btn step-move-btn"
      ${at === 0 ? 'disabled' : ''}
      onclick="moveStep('${scenario.id}','${step.id}',-1)"
      title="Monter"
    >
      ↑
    </button>
    <button
      class="icon-btn step-move-btn"
      ${at === scenario.steps.length - 1 ? 'disabled' : ''}
      onclick="moveStep('${scenario.id}','${step.id}',1)"
      title="Descendre"
    >
      ↓
    </button>
  `;
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
