function stepList(scenario) {
  return /* HTML */ `<div class="step-list">
    ${scenario.steps.map((st, idx) => stepCard(scenario, st, idx)).join('')}
  </div>`;
}
