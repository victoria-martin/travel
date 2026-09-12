const MAX_STEP_ATTRACTION_COUNT = 10;
const STEP_ATTRACTION_COUNTS = Array.from({ length: MAX_STEP_ATTRACTION_COUNT }, (_, i) => i + 1);

function attractionCount(entry) {
  return parseInt(entry.count) || 1;
}

function attractionCountLabel(n) {
  return `${n} ×`;
}

function pickStepAttractionCount(scenarioId, stepId, index, count) {
  openInlineMenu = null;
  setStepAttractionCount(scenarioId, stepId, index, count);
}

function stepAttractionCountDropdown(scenario, step, entry, index) {
  const current = attractionCount(entry);
  return inlineDropdown(
    `attraction-count:${step.id}:${index}`,
    'attraction-count-dropdown',
    /* HTML */ `<summary class="inline-tag">${tagLabel('', attractionCountLabel(current))}</summary>
      <div class="inline-menu">
        ${STEP_ATTRACTION_COUNTS.map(
          (n) => `<button
            class="inline-menu-item ${n === current ? 'selected' : ''}"
            onclick="pickStepAttractionCount('${scenario.id}','${step.id}',${index},${n})"
          >
            ${attractionCountLabel(n)}
          </button>`,
        ).join('')}
      </div>`,
  );
}
