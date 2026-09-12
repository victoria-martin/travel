// Une attraction d'étape tient la même grille que la ligne hébergement : lieu, quantité, budget.
function stepAttractionRow(scenario, step, entry, index) {
  const attraction = getAttraction(entry.attractionId);
  return /* HTML */ `<div class="step-acc step-attraction">
    <span class="inline-tag inline-tag-static">
      ${
        attraction
          ? tagLabel(attractionType(attraction.type).emoji, escapeHtml(attraction.name))
          : tagLabel('❔', 'Attraction supprimée')
      }
    </span>
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
