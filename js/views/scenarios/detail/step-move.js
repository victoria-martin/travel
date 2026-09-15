/*
  Une étape se déplace d'un rang sous la poignée qui la glisse plus loin. Dans une colonne, ce
  rang est celui de ses pairs : deux étapes de colonnes différentes ne s'échangent jamais, la
  seconde couperait un groupe en deux. Hors d'un groupe, c'est celui des rangées de la liste —
  l'étape enjambe donc le groupe voisin d'un tenant et se pose contre lui, jamais au-delà.
*/
function stepMoveUnits(scenario, step) {
  if (step.optionId) return optionSteps(scenario, step.optionId).map((st) => [st]);
  return stepRows(scenario).map((row) =>
    row.group ? groupSteps(scenario, row.group) : [row.step],
  );
}

function stepNeighbourUnit(scenario, step, dir) {
  const units = stepMoveUnits(scenario, step);
  const from = units.findIndex((unit) => unit.includes(step));
  return units[from + dir] || null;
}

function stepMoveButtons(scenario, step) {
  const moveButton = (dir, label, title) =>
    /* HTML */ `<button
      class="icon-btn step-move-btn"
      ${stepNeighbourUnit(scenario, step, dir) ? '' : 'disabled'}
      onclick="moveStep('${scenario.id}','${step.id}',${dir})"
      title="${title}"
    >
      ${label}
    </button>`;
  return moveButton(-1, '↑', 'Monter') + moveButton(1, '↓', 'Descendre');
}

// Les deux unités échangent leurs places : leurs rangs sont repris dans l'ordre du scénario, et
// remplis par la seconde puis la première.
function moveStep(scenarioId, stepId, dir) {
  const s = getScenario(scenarioId);
  const step = getStep(scenarioId, stepId);
  const neighbour = stepNeighbourUnit(s, step, dir);
  if (!neighbour) return;
  const unit = stepMoveUnits(s, step).find((u) => u.includes(step));
  const [first, second] = dir > 0 ? [unit, neighbour] : [neighbour, unit];
  const slots = [...first, ...second].map((st) => s.steps.indexOf(st)).sort((a, b) => a - b);
  [...second, ...first].forEach((st, i) => (s.steps[slots[i]] = st));
  saveNow();
  render();
}
