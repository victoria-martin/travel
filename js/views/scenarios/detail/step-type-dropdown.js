/*
  Le premier des deux selects d'une étape : il dit quel type d'hébergement on cherche, et les
  hébergements du select de lieu s'y restreignent — les villes, elles, y sont toujours. Sans type,
  le ＋ reste discret comme celui d'une colonne en plus.
*/
function pickStepAccommodationType(scenarioId, stepId, type) {
  openInlineMenu = null;
  setStepAccommodationType(scenarioId, stepId, type);
}

function stepTypeLabel(type) {
  if (!type) return tagLabel('', `${svgIcon('plus')} type`);
  const t = accType(type);
  return tagLabel(t.emoji, t.label);
}

function stepTypeDropdown(scenario, step) {
  const current = accTypeKey(step.accommodationType);
  const pick = (type) => `pickStepAccommodationType('${scenario.id}','${step.id}','${type}')`;
  return inlineDropdown(
    `acc-type:${step.id}`,
    'type-dropdown',
    /* HTML */ `<summary class="inline-tag${current ? '' : ' inline-tag-empty'}">
        ${stepTypeLabel(current)}
      </summary>
      <div class="inline-menu">
        <button class="inline-menu-item ${current ? '' : 'selected'}" onclick="${pick('')}">
          Tous les lieux
        </button>
        ${Object.entries(ACCOMMODATION_TYPES)
          .map(
            ([key, t]) => `<button
              class="inline-menu-item ${key === current ? 'selected' : ''}"
              onclick="${pick(key)}"
            >
              ${tagLabel(t.emoji, t.label)}
            </button>`,
          )
          .join('')}
      </div>`,
  );
}
