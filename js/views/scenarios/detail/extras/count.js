const MAX_EXTRA_COUNT = 10;
const EXTRA_COUNTS = Array.from({ length: MAX_EXTRA_COUNT }, (_, i) => i + 1);

function extraCountLabel(n) {
  return `×${n}`;
}

function pickExtraCount(scenarioId, stepId, lineId, count) {
  openInlineMenu = null;
  setExtraCount(scenarioId, stepId, lineId, count);
}

// Une seule fois ne se dit pas : la pastille ne s'affiche qu'au survol tant que le nombre vaut 1.
function extraCountDropdown(scenario, step, line) {
  const current = extraCount(line);
  return inlineDropdown(
    `extra-count:${line.id}`,
    `extra-count-dropdown${current === 1 ? ' extra-count-once' : ''}`,
    /* HTML */ `<summary class="inline-tag">${extraCountLabel(current)}</summary>
      <div class="inline-menu">
        ${EXTRA_COUNTS.map(
          (n) => `<button
            class="inline-menu-item ${n === current ? 'selected' : ''}"
            onclick="pickExtraCount('${scenario.id}','${step.id}','${line.id}',${n})"
          >
            ${extraCountLabel(n)}
          </button>`,
        ).join('')}
      </div>`,
  );
}
