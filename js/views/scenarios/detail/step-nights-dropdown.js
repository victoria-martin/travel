function pickStepNights(scenarioId, stepId, nights) {
  openInlineMenu = null;
  setStepNights(scenarioId, stepId, nights);
}

function stepNightsDropdown(scenario, step) {
  const current = parseInt(step.nights) || 0;
  return inlineDropdown(
    `nights:${step.id}`,
    'nights-dropdown',
    /* HTML */ `<summary class="inline-tag">${tagLabel('', nightsLabel(current))}</summary>
      <div class="inline-menu">
        ${NIGHTS_OPTIONS.map(
          (n) => `<button
            class="inline-menu-item ${n === current ? 'selected' : ''}"
            onclick="pickStepNights('${scenario.id}','${step.id}',${n})"
          >
            ${nightsLabel(n)}
          </button>`,
        ).join('')}
      </div>`,
  );
}
