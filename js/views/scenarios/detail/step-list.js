// La liste montre tout, dans l'ordre de stockage ; seules les étapes visibles portent un rang.
function stepList(scenario) {
  let rank = 0;
  return /* HTML */ `<div class="step-list">
    ${scenario.steps
      .map(
        (st, i) =>
          (i === 0 ? '' : stepInsertGap(scenario, i)) +
          stepCard(scenario, st, st.hidden ? null : rank++),
      )
      .join('')}
  </div>`;
}

function stepInsertGap(scenario, index) {
  return /* HTML */ `<div class="step-gap">
    ${inlineDropdown(
      `insert-step:${index}`,
      'insert-step-dropdown',
      /* HTML */ `<summary class="icon-btn" title="Insérer une étape ici">＋</summary>
        <div class="inline-menu">
          <button class="inline-menu-item" onclick="insertStep('${scenario.id}',${index},1)">
            Créer une étape
          </button>
          <button class="inline-menu-item" onclick="insertStep('${scenario.id}',${index},2)">
            Créer une étape avec options
          </button>
        </div>`,
    )}
  </div>`;
}
