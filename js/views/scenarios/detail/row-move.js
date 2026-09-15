/*
  Une rangée se déplace d'un rang sous ses flèches : une étape ordinaire et un groupe enjambent
  chacun leur voisin d'un tenant, donc l'un se pose contre l'autre et ne l'enjambe pas pour
  atterrir au-delà. Dans une colonne, ce rang est celui des seuls pairs de l'étape : deux étapes
  de colonnes différentes ne s'échangent jamais, la seconde couperait un groupe en deux.
*/
function rowUnits(scenario) {
  return stepRows(scenario).map((row) =>
    row.group ? groupSteps(scenario, row.group) : [row.step],
  );
}

function stepUnits(scenario, step) {
  if (step.optionId) return optionSteps(scenario, step.optionId).map((st) => [st]);
  return rowUnits(scenario);
}

function neighbourUnit(units, unit, dir) {
  return units[units.indexOf(unit) + dir] || null;
}

function moveButtons(units, unit, call) {
  const moveButton = (dir, label, title) =>
    /* HTML */ `<button
      class="icon-btn step-move-btn"
      ${neighbourUnit(units, unit, dir) ? '' : 'disabled'}
      onclick="${call(dir)}"
      title="${title}"
    >
      ${label}
    </button>`;
  return (
    moveButton(-1, svgIcon('arrow-up'), 'Monter') +
    moveButton(1, svgIcon('arrow-down'), 'Descendre')
  );
}

function stepMoveButtons(scenario, step) {
  const units = stepUnits(scenario, step);
  return moveButtons(
    units,
    units.find((unit) => unit.includes(step)),
    (dir) => `moveStep('${scenario.id}','${step.id}',${dir})`,
  );
}

function groupMoveButtons(scenario, group) {
  const units = rowUnits(scenario);
  return moveButtons(
    units,
    units.find((unit) => unit[0].groupId === group.id),
    (dir) => `moveGroup('${scenario.id}','${group.id}',${dir})`,
  );
}

// Les deux unités échangent leurs places : leurs rangs sont repris dans l'ordre du scénario, et
// remplis par la seconde puis la première.
function moveUnit(scenario, unit, neighbour, dir) {
  if (!unit || !neighbour) return;
  const [first, second] = dir > 0 ? [unit, neighbour] : [neighbour, unit];
  const slots = [...first, ...second].map((st) => scenario.steps.indexOf(st)).sort((a, b) => a - b);
  [...second, ...first].forEach((st, i) => (scenario.steps[slots[i]] = st));
  saveNow();
  render();
}

function moveStep(scenarioId, stepId, dir) {
  const scenario = getScenario(scenarioId);
  const step = getStep(scenarioId, stepId);
  const units = stepUnits(scenario, step);
  const unit = units.find((u) => u.includes(step));
  moveUnit(scenario, unit, neighbourUnit(units, unit, dir), dir);
}

function moveGroup(scenarioId, groupId, dir) {
  const scenario = getScenario(scenarioId);
  const units = rowUnits(scenario);
  const unit = units.find((u) => u[0].groupId === groupId);
  moveUnit(scenario, unit, neighbourUnit(units, unit, dir), dir);
}
