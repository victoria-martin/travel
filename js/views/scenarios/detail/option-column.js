/*
  Une colonne : son nom, ses étapes, et le pied qui dit ce qu'elle dure et ce qu'elle coûte. Une
  colonne écartée se date et se chiffre comme si elle était retenue — sans quoi il n'y aurait rien
  à comparer — mais ses cartes n'ont pas de rang, puisqu'elles ne sont sur aucun tracé.
*/
function optionColumn(scenario, group, option, ranks) {
  const steps = optionSteps(scenario, option.id);
  const arrival = groupArrival(scenario, group);
  let nightsBefore = 0;
  const cards = steps.map((step, i) => {
    const card = stepCard(scenario, step, ranks[step.id], dateAfter(arrival, nightsBefore));
    nightsBefore += stepNights(step);
    return (i === 0 ? '' : columnInsertGap(scenario, step, option)) + card;
  });
  const after = steps.length ? scenario.steps.indexOf(steps[steps.length - 1]) + 1 : 0;
  return /* HTML */ `<div class="option-column${option.isSelected ? ' option-column-chosen' : ''}">
    ${optionColumnHead(scenario, group, option)} ${cards.join('')}
    <div class="step-gap">${addStepButton(scenario, after, option)}</div>
    ${optionColumnFoot(scenario, option)}
  </div>`;
}

function optionColumnHead(scenario, group, option) {
  return /* HTML */ `<div class="option-head">
    ${editableText(
      option.name,
      `setGroupOptionName('${scenario.id}','${group.id}','${option.id}', this.innerText)`,
      { key: `option:${option.id}:name`, placeholder: groupOptionName(group, option) },
    )}
    ${optionChosenButton(scenario, group, option)}
    <button
      class="icon-btn option-remove"
      onclick="removeGroupOption('${scenario.id}','${group.id}','${option.id}')"
      title="Retirer cette colonne et ses étapes"
    >
      ✕
    </button>
  </div>`;
}

function optionColumnFoot(scenario, option) {
  return /* HTML */ `<div class="option-foot">
    <span class="option-foot-nights">${nightsLabel(optionNights(scenario, option))}</span>
    <strong>${formatCosts(optionCost(scenario, option))}</strong>
  </div>`;
}

function optionChosenButton(scenario, group, option) {
  return /* HTML */ `<button
    class="option-chosen${option.isSelected ? ' option-chosen-on' : ''}"
    onclick="chooseGroupOption('${scenario.id}','${group.id}','${option.id}')"
    title="${option.isSelected ? 'Ne plus retenir cette colonne' : 'Retenir cette colonne'}"
  >
    ${option.isSelected ? '◉' : '○'}
  </button>`;
}

// Dans une colonne le ＋ n'a qu'un geste : l'étape naît dans la colonne, donc pas de menu.
function columnInsertGap(scenario, step, option) {
  return /* HTML */ `<div class="step-gap">
    ${stepLegSlot(scenario, step)} ${addStepButton(scenario, scenario.steps.indexOf(step), option)}
  </div>`;
}

function addStepButton(scenario, index, option) {
  return /* HTML */ `<button
    class="icon-btn"
    title="Insérer une étape ici"
    onclick="insertOptionStep('${scenario.id}',${index},'${option.id}')"
  >
    ＋
  </button>`;
}
