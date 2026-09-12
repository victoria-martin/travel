// La liste montre tout, dans l'ordre de stockage ; seules les étapes visibles portent un rang.
function stepList(scenario) {
  let rank = 0;
  return /* HTML */ `<div class="step-list">
    ${scenario.steps.map((st) => stepCard(scenario, st, st.hidden ? null : rank++)).join('')}
  </div>`;
}
