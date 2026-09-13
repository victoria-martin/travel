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
    <button
      class="icon-btn"
      onclick="insertStep('${scenario.id}',${index})"
      title="Insérer une étape ici"
    >
      ＋
    </button>
  </div>`;
}
