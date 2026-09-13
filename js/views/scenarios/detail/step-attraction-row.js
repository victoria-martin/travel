// Une attraction d'étape tient la même grille que la ligne hébergement : lieu, quantité, budget.
function stepAttractionRow(scenario, step, entry, index) {
  return /* HTML */ `<div class="step-acc step-attraction">
    ${stepAttractionDropdown(scenario, step, entry, index)}
    ${stepAttractionCountDropdown(scenario, step, entry, index)}
    <span class="step-total">
      <span class="step-budget"
        >${editableText(
          entry.budget,
          `setStepAttractionBudget('${scenario.id}','${step.id}',${index}, this.innerText)`,
          { key: `step:${step.id}:attraction:${index}:budget`, placeholder: 'budget…' },
        )}${String(entry.budget || '').trim() ? ' €' : ''}</span
      >
    </span>
  </div>`;
}
