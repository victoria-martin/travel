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
  return /* HTML */ `<div
    id="option-column-${option.id}"
    class="option-column${option.isSelected ? ' option-column-chosen' : ''}"
  >
    ${optionColumnHead(scenario, group, option)} ${cards.join('')}
    <div class="step-gap">${addStepButton(scenario, after, option)}</div>
    ${optionColumnFoot(scenario, option)} ${optionKeepButton(scenario, group, option)}
  </div>`;
}

// Le ✕ ne s'offre qu'à partir de trois colonnes : à deux, retirer l'une revient à terminer la
// comparaison, et c'est « Garder celle-ci » qui le dit.
function optionColumnHead(scenario, group, option) {
  const removable = groupOptions(group).length > 2;
  return /* HTML */ `<div class="option-head">
    <span class="option-rank">${groupOptionName(group, option)}</span>
    ${optionChosenButton(scenario, group, option)}
    ${
      removable
        ? /* HTML */ `<button
            class="icon-btn option-remove"
            onclick="removeGroupOption('${scenario.id}','${group.id}','${option.id}')"
            title="Retirer cette colonne et ses étapes"
          >
            ✕
          </button>`
        : ''
    }
  </div>`;
}

/*
  Terminer la comparaison : les autres colonnes se replient, celle-ci redevient une étape ordinaire
  du fil. Le bouton reste affiché plutôt que de naître au survol — c'est la sortie du groupe, elle
  ne se devine pas.
*/
function optionKeepButton(scenario, group, option) {
  if (groupOptions(group).length > 2) return '';
  return /* HTML */ `<button
    class="inline-tag option-keep"
    onclick="keepGroupOption('${scenario.id}','${group.id}','${option.id}')"
    title="Terminer la comparaison et ne garder que cette colonne"
  >
    Garder celle-ci
  </button>`;
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
