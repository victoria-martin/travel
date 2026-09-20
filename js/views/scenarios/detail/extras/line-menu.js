/*
  La pastille d'une ligne ouvre ses alternatives du même genre : une activité se remplace par une
  activité, une dépense par une dépense. Celles déjà posées sur le même porteur n'y figurent pas —
  un porteur n'en porte jamais deux fois la même.
*/

function pickExtraAttraction(scenarioId, holderId, lineId, attractionId) {
  openInlineMenu = null;
  setExtraAttraction(scenarioId, holderId, lineId, attractionId);
}

function pickExtraCost(scenarioId, holderId, lineId, costId) {
  openInlineMenu = null;
  setExtraCost(scenarioId, holderId, lineId, costId);
}

function extraSiblingIds(holder, line, field) {
  return holderExtras(holder)
    .filter((other) => other.id !== line.id)
    .map((other) => other[field])
    .filter(Boolean);
}

function extraAlternatives(scenario, holder, line) {
  if (line.costId)
    return costMatches('', extraSiblingIds(holder, line, 'costId'))
      .map(
        (cost) => `<button
          class="inline-menu-item ${cost.id === line.costId ? 'selected' : ''}"
          onclick="pickExtraCost('${scenario.id}','${holder.id}','${line.id}','${cost.id}')"
        >
          ${tagLabel(EXPENSE_ICON, escapeHtml(costLabel(cost)))}
        </button>`,
      )
      .join('');
  return attractionMatches('', extraSiblingIds(holder, line, 'attractionId'))
    .map(
      (a) => `<button
        class="inline-menu-item ${a.id === line.attractionId ? 'selected' : ''}"
        onclick="pickExtraAttraction('${scenario.id}','${holder.id}','${line.id}','${a.id}')"
      >
        ${tagLabel(attractionType(a.type).emoji, escapeHtml(a.name))}
      </button>`,
    )
    .join('');
}

function extraResourceItem(line) {
  if (line.costId) return openResourceMenuItem(`openModal('charge','${line.costId}')`);
  if (line.attractionId) return openResourceMenuItem(`openAttractionSheet('${line.attractionId}')`);
  return '';
}

function extraSelectionItem(scenario, holder, line) {
  const label = line.costId
    ? tagLabel(EXPENSE_ICON, escapeHtml(costLabel(getFixedCost(line.costId))))
    : tagLabel(
        attractionType(getAttraction(line.attractionId).type).emoji,
        escapeHtml(getAttraction(line.attractionId).name),
      );
  return `<div class="inline-menu-row inline-menu-row-selected">
    <button class="inline-menu-item selected">${label}</button>
    <button
      class="inline-menu-item-remove"
      onclick="detachExtra('${scenario.id}','${holder.id}','${line.id}')"
      title="Désélectionner"
      aria-label="Désélectionner"
    >
      ${svgIcon('x')}
    </button>
  </div>`;
}

function extraMenu(scenario, holder, line) {
  return inlineDropdown(
    `extra:${line.id}`,
    'extra-dropdown',
    /* HTML */ `<summary class="inline-tag">${extraLabel(line)}</summary>
      <div class="inline-menu">
        ${extraResourceItem(line)} ${extraSelectionItem(scenario, holder, line)}
        ${extraAlternatives(scenario, holder, line)}
      </div>`,
  );
}
