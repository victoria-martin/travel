/*
  La pastille d'une ligne ouvre ses alternatives du même genre : une activité se remplace par une
  activité, une dépense par une dépense. Celles déjà posées sur le même porteur n'y figurent pas —
  une étape ne porte jamais deux fois la même.
*/

function pickExtraAttraction(scenarioId, stepId, lineId, attractionId) {
  openInlineMenu = null;
  setExtraAttraction(scenarioId, stepId, lineId, attractionId);
}

function pickExtraCost(scenarioId, stepId, lineId, costId) {
  openInlineMenu = null;
  setExtraCost(scenarioId, stepId, lineId, costId);
}

function extraSiblingIds(step, line, field) {
  return holderExtras(step, line.optionId)
    .filter((other) => other.id !== line.id)
    .map((other) => other[field])
    .filter(Boolean);
}

function extraAlternatives(scenario, step, line) {
  if (line.costId)
    return costMatches('', extraSiblingIds(step, line, 'costId'))
      .map(
        (cost) => `<button
          class="inline-menu-item ${cost.id === line.costId ? 'selected' : ''}"
          onclick="pickExtraCost('${scenario.id}','${step.id}','${line.id}','${cost.id}')"
        >
          ${tagLabel(EXPENSE_EMOJI, escapeHtml(costLabel(cost)))}
        </button>`,
      )
      .join('');
  return attractionMatches('', extraSiblingIds(step, line, 'attractionId'))
    .map(
      (a) => `<button
        class="inline-menu-item ${a.id === line.attractionId ? 'selected' : ''}"
        onclick="pickExtraAttraction('${scenario.id}','${step.id}','${line.id}','${a.id}')"
      >
        ${tagLabel(attractionType(a.type).emoji, escapeHtml(a.name))}
      </button>`,
    )
    .join('');
}

function extraMenu(scenario, step, line) {
  return inlineDropdown(
    `extra:${line.id}`,
    'extra-dropdown',
    /* HTML */ `<summary class="inline-tag">${extraLabel(line)}</summary>
      <div class="inline-menu">
        <button
          class="inline-menu-item"
          onclick="detachExtra('${scenario.id}','${step.id}','${line.id}')"
        >
          Retirer cette ligne
        </button>
        ${extraAlternatives(scenario, step, line)}
      </div>`,
  );
}
