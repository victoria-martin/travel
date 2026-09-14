/*
  Le premier des deux selects d'une étape : il dit quel type d'hébergement on cherche, et le
  select de lieu s'y restreint. Sans type, le ＋ reste discret comme celui d'une colonne en plus,
  et le lieu propose tout — villes comprises.
*/
function pickStepAccommodationType(scenarioId, stepId, type) {
  openInlineMenu = null;
  setStepAccommodationType(scenarioId, stepId, type);
}

function stepTypeLabel(type) {
  if (!type) return tagLabel('', '＋ type');
  const t = accType(type);
  return tagLabel(t.emoji, t.label);
}

function stepTypeDropdown(scenario, step) {
  const current = accTypeKey(step.accommodationType);
  const pick = (type) => `pickStepAccommodationType('${scenario.id}','${step.id}','${type}')`;
  return inlineDropdown(
    `acc-type:${step.id}`,
    'type-dropdown',
    /* HTML */ `<summary class="inline-tag${current ? '' : ' step-add-type'}">
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
