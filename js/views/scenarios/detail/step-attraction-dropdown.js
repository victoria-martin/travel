/*
  La pastille d'une attraction attachée ouvre le même menu que le lieu de l'étape : on en change,
  ou on la détache. Les autres attractions de l'étape n'y figurent pas — une étape ne porte pas
  deux fois la même.
*/

function stepAttractionLabel(entry) {
  const attraction = getAttraction(entry.attractionId);
  return attraction
    ? tagLabel(attractionType(attraction.type).emoji, escapeHtml(attraction.name))
    : tagLabel('❔', 'Attraction supprimée');
}

function pickStepAttraction(scenarioId, stepId, index, attractionId) {
  openInlineMenu = null;
  setStepAttraction(scenarioId, stepId, index, attractionId);
}

function stepAttractionDropdown(scenario, step, entry, index) {
  const others = (step.attractions || [])
    .map((e) => e.attractionId)
    .filter((id) => id !== entry.attractionId);
  return inlineDropdown(
    `attraction:${step.id}:${index}`,
    'attraction-dropdown',
    /* HTML */ `<summary class="inline-tag">${stepAttractionLabel(entry)}</summary>
      <div class="inline-menu">
        <button
          class="inline-menu-item"
          onclick="detachStepAttraction('${scenario.id}','${step.id}',${index})"
        >
          Retirer cette attraction
        </button>
        ${attractionMatches('', others)
          .map(
            (a) => `<button
              class="inline-menu-item ${a.id === entry.attractionId ? 'selected' : ''}"
              onclick="pickStepAttraction('${scenario.id}','${step.id}',${index},'${a.id}')"
            >
              ${tagLabel(attractionType(a.type).emoji, escapeHtml(a.name))}
            </button>`,
          )
          .join('')}
      </div>`,
  );
}
