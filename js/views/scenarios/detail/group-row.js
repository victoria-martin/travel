/*
  Un groupe : ses colonnes côte à côte, et sous elles les lignes qui valent quelle que soit celle
  qu'on retient. Il garde le nom de l'étape qui s'est ouverte en options — c'est ce que les colonnes
  comparent — et dit combien elles sont et quand le groupe commence, une date commune puisque
  toutes partent du même jour.
*/
function groupRow(scenario, group, ranks) {
  return /* HTML */ `<div class="step-group">
    <div class="step-group-head">
      <div class="step-group-title">
        <span class="step-group-fork" title="Étape à options">⑂</span>
        ${editableText(
          group.name,
          `renameStepGroup('${scenario.id}','${group.id}', this.innerText)`,
          {
            key: `group:${group.id}:name`,
            placeholder: 'Nom de l’étape…',
          },
        )}
        <span class="step-title-dates">${groupArrivalLabel(scenario, group)}</span>
      </div>
      <span class="step-group-count">${groupOptions(group).length} options — une seule compte</span>
    </div>
    <div class="option-columns">
      ${groupOptions(group)
        .map((option) => optionColumn(scenario, group, option, ranks))
        .join('')}
    </div>
    <div class="step-group-foot">
      ${addOptionButton(scenario, group)} ${extrasBlock(scenario, group)}
    </div>
  </div>`;
}

function groupArrivalLabel(scenario, group) {
  const arrival = groupArrival(scenario, group);
  return arrival ? `à partir du ${escapeHtml(formatStepDate(arrival))}` : '';
}

function addOptionButton(scenario, group) {
  return /* HTML */ `<button
    class="inline-tag step-add-option"
    title="Comparer une colonne de plus"
    onclick="addGroupOption('${scenario.id}','${group.id}')"
  >
    ＋ option
  </button>`;
}
