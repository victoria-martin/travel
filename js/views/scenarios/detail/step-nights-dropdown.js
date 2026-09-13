function pickStepNights(scenarioId, stepId, optionId, nights) {
  openInlineMenu = null;
  setStepNights(scenarioId, stepId, optionId, nights);
}

function stepNightsDropdown(scenario, step, option) {
  const current = parseInt(option.nights) || 0;
  return inlineDropdown(
    `nights:${option.id}`,
    'nights-dropdown',
    /* HTML */ `<summary class="inline-tag">${tagLabel('', nightsLabel(current))}</summary>
      <div class="inline-menu">
        ${NIGHTS_OPTIONS.map(
          (n) => `<button
            class="inline-menu-item ${n === current ? 'selected' : ''}"
            onclick="pickStepNights('${scenario.id}','${step.id}','${option.id}',${n})"
          >
            ${nightsLabel(n)}
          </button>`,
        ).join('')}
      </div>`,
  );
}
