// La liste montre tout, dans l'ordre de stockage ; seules les étapes visibles portent un rang.
function stepList(scenario) {
  const ranks = stepRanks(scenario);
  return /* HTML */ `<div class="step-list">
    ${stepRows(scenario)
      .map(
        (row, i) => (i === 0 ? '' : stepInsertGap(scenario, row)) + stepRow(scenario, row, ranks),
      )
      .join('')}
    ${stepAppendRow(scenario)}
  </div>`;
}

function stepRow(scenario, row, ranks) {
  if (row.group) return groupRow(scenario, row.group, ranks);
  const rank = ranks[row.step.id];
  return stepCard(scenario, row.step, rank, rank === null ? null : stepArrival(scenario, rank));
}

function stepInsertGap(scenario, row) {
  return /* HTML */ `<div class="step-gap">
    ${stepLegSlot(scenario, rowLeadStep(scenario, row))}
    ${inlineDropdown(
      `insert-step:${row.index}`,
      'insert-step-dropdown',
      /* HTML */ `<summary class="icon-btn" title="Insérer une étape ici">＋</summary>
        <div class="inline-menu">${stepInsertItems(scenario, row.index)}</div>`,
    )}
  </div>`;
}

/*
  Le ＋ d'entre deux cartes est un fantôme, celui du pied ne l'est pas : c'est le seul endroit où
  poser une étape après la dernière, et le seul geste d'un scénario vide.
*/
function stepAppendRow(scenario) {
  return /* HTML */ `<div class="step-append">
    ${inlineDropdown(
      'append-step',
      'insert-step-dropdown',
      /* HTML */ `<summary class="btn btn-ghost btn-small">＋ Ajouter une étape</summary>
        <div class="inline-menu">${stepInsertItems(scenario, scenario.steps.length)}</div>`,
    )}
  </div>`;
}

function stepInsertItems(scenario, index) {
  return /* HTML */ `<button
      class="inline-menu-item"
      onclick="insertStep('${scenario.id}',${index})"
    >
      Créer une étape
    </button>
    <button class="inline-menu-item" onclick="insertStepGroup('${scenario.id}',${index})">
      Créer une étape avec options
    </button>`;
}
