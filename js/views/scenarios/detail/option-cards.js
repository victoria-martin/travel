/*
  Les options d'une étape. Seule : elle se lit comme la ligne qu'elle a toujours été — lieu, nuits,
  prix. Plusieurs : elles se comparent en cards, chacune avec son nom et sa pastille de sélection,
  et c'est celle qui est retenue qui donne à l'étape ses nuits, son lieu et son coût.
*/
function stepOptionsBlock(scenario, step) {
  const options = stepOptions(step);
  if (options.length < 2)
    return /* HTML */ `<div class="step-acc">
      ${optionLine(scenario, step, options[0] || NO_OPTION)} ${addOptionButton(scenario, step)}
    </div>`;
  return /* HTML */ `<div class="step-options">
    ${options.map((option) => optionCard(scenario, step, option)).join('')}
    <div class="step-option-adds">${addOptionButton(scenario, step)}</div>
  </div>`;
}

function optionLine(scenario, step, option) {
  return /* HTML */ `${stepTypeDropdown(scenario, step, option)}
  ${stepPlaceDropdown(scenario, step, option)} ${stepNightsDropdown(scenario, step, option)}
  ${optionPriceSlot(scenario, step, option)}`;
}

function optionCard(scenario, step, option) {
  return /* HTML */ `<div class="option-card${option.isSelected ? ' option-card-chosen' : ''}">
    <div class="option-head">
      ${editableText(
        option.name,
        `setStepOptionName('${scenario.id}','${step.id}','${option.id}', this.innerText)`,
        { key: `option:${option.id}:name`, placeholder: stepOptionName(step, option) },
      )}
      <button
        class="icon-btn option-remove"
        onclick="removeStepOption('${scenario.id}','${step.id}','${option.id}')"
        title="Retirer cette option"
      >
        ✕
      </button>
    </div>
    ${stepTypeDropdown(scenario, step, option)} ${stepPlaceDropdown(scenario, step, option)}
    ${stepNightsDropdown(scenario, step, option)}
    <div class="option-foot">
      ${optionPriceSlot(scenario, step, option)} ${optionChosenButton(scenario, step, option)}
    </div>
    ${extrasBlock(scenario, step, option.id)}
  </div>`;
}

// Le budget saisi remplace le prix calculé de l'hébergement ; sans budget, on montre le calcul.
function optionPriceSlot(scenario, step, option) {
  const acc = getAccommodation(option.accommodationId);
  const auto = optionAccommodationCost(option);
  return /* HTML */ `<span class="step-total">
    ${
      !hasOptionBudget(option) && auto
        ? `<span class="step-total-auto">${formatAccommodationCost(acc, auto)}</span>`
        : ''
    }
    <span class="step-budget"
      >${editableText(
        option.budget,
        `setStepBudget('${scenario.id}','${step.id}','${option.id}', this.innerText)`,
        { key: `option:${option.id}:budget`, placeholder: 'Budget…' },
      )}${hasOptionBudget(option) ? ' €' : ''}</span
    >
  </span>`;
}

function optionChosenButton(scenario, step, option) {
  return /* HTML */ `<button
    class="option-chosen${option.isSelected ? ' option-chosen-on' : ''}"
    onclick="chooseStepOption('${scenario.id}','${step.id}','${option.id}')"
    title="${option.isSelected ? 'Ne plus retenir cette option' : 'Retenir cette option'}"
  >
    ${option.isSelected ? '◉' : '○'}
  </button>`;
}

function addOptionButton(scenario, step) {
  return /* HTML */ `<button
    class="inline-tag step-add-option"
    title="Comparer une autre option"
    onclick="addStepOption('${scenario.id}','${step.id}')"
  >
    ＋ option
  </button>`;
}
