// La liste montre tout, dans l'ordre de stockage ; seules les étapes visibles portent un rang.
function stepList(scenario) {
  const ranks = stepRanks(scenario);
  return /* HTML */ `<div class="step-list">
    ${stepRows(scenario)
      .map(
        (row, i) => (i === 0 ? '' : stepInsertGap(scenario, row)) + stepRow(scenario, row, ranks),
      )
      .join('')}
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
        <div class="inline-menu">
          <button class="inline-menu-item" onclick="insertStep('${scenario.id}',${row.index})">
            Créer une étape
          </button>
          <button class="inline-menu-item" onclick="insertStepGroup('${scenario.id}',${row.index})">
            Créer une étape avec options
          </button>
        </div>`,
    )}
  </div>`;
}
