/*
  Une étape se déplace dans sa portée, un rang à la fois, sous la poignée qui la glisse plus loin :
  sa colonne si elle appartient à un groupe, la liste sinon. Deux étapes de portées différentes ne
  s'échangent jamais — la seconde enjamberait un groupe et le couperait en deux.
*/
function stepPeers(scenario, step) {
  return scenario.steps.filter((st) => st.optionId === step.optionId);
}

function stepNeighbour(scenario, step, dir) {
  const peers = stepPeers(scenario, step);
  return peers[peers.indexOf(step) + dir] || null;
}

function stepMoveButtons(scenario, step) {
  const moveButton = (dir, label, title) =>
    /* HTML */ `<button
      class="icon-btn step-move-btn"
      ${stepNeighbour(scenario, step, dir) ? '' : 'disabled'}
      onclick="moveStep('${scenario.id}','${step.id}',${dir})"
      title="${title}"
    >
      ${label}
    </button>`;
  return moveButton(-1, '↑', 'Monter') + moveButton(1, '↓', 'Descendre');
}

function moveStep(scenarioId, stepId, dir) {
  const s = getScenario(scenarioId);
  const step = getStep(scenarioId, stepId);
  const neighbour = stepNeighbour(s, step, dir);
  if (!neighbour) return;
  const [i, j] = [s.steps.indexOf(step), s.steps.indexOf(neighbour)];
  [s.steps[i], s.steps[j]] = [s.steps[j], s.steps[i]];
  saveNow();
  render();
}
