// La ligne d'une étape : ce qu'on y cherche, où l'on dort, combien de nuits, et ce que ça coûte.
function stepLine(scenario, step) {
  return /* HTML */ `${stepTypeDropdown(scenario, step)} ${stepPlaceDropdown(scenario, step)}
  ${stepNightsDropdown(scenario, step)} ${stepPriceSlot(scenario, step)}`;
}

// Le budget saisi remplace le prix calculé de l'hébergement ; sans budget, on montre le calcul.
function stepPriceSlot(scenario, step) {
  const acc = getAccommodation(step.accommodationId);
  const auto = stepAccommodationCost(step);
  return /* HTML */ `<span class="step-total">
    ${
      !hasStepBudget(step) && auto
        ? `<span class="step-total-auto">${formatAccommodationCost(acc, auto)}</span>`
        : ''
    }
    <span class="step-budget"
      >${editableText(step.budget, `setStepBudget('${scenario.id}','${step.id}', this.innerText)`, {
        key: `step:${step.id}:budget`,
        placeholder: 'Budget…',
      })}${hasStepBudget(step) ? ' €' : ''}</span
    >
  </span>`;
}
