function scenarioList(scenarios) {
  return /* HTML */ `<div class="scenario-list">
    ${scenarios.map((s) => scenarioRow(s)).join('')}
  </div>`;
}
