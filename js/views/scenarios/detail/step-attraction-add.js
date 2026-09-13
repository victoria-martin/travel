/*
  Le ＋ d'une carte d'étape : une pastille au bout de la ligne hébergement, invisible tant que la
  souris n'est pas sur la carte, qui ouvre le même menu déroulant que le lieu ou le nombre de nuits.
  Le menu s'ouvre sur un champ de recherche, parce que les attractions d'un voyage se comptent par
  dizaines ; la frappe ne repeint que la liste, sinon le champ perdrait sa saisie à chaque lettre.
  Les identifiants portent l'étape : chaque carte rend son menu, ouvert ou non.
*/

function stepAttractionAddButton(scenario, step) {
  return inlineDropdown(
    `attraction-add:${step.id}`,
    'attraction-add-dropdown',
    /* HTML */ `<summary
        class="inline-tag step-add-attraction"
        title="Ajouter une attraction"
        onclick="setTimeout(() => focusStepAttractionSearch('${step.id}'))"
      >
        ＋
      </summary>
      <div class="inline-menu">
        <input
          class="inline-menu-search"
          id="attraction-search-${step.id}"
          type="text"
          placeholder="Chercher une attraction…"
          oninput="repaintStepAttractionOptions('${scenario.id}','${step.id}')"
          onkeydown="stepAttractionSearchKeydown(event,'${scenario.id}','${step.id}')"
        />
        <div id="attraction-options-${step.id}">${stepAttractionOptions(scenario.id, step.id)}</div>
      </div>`,
  );
}

function focusStepAttractionSearch(stepId) {
  const input = document.getElementById(`attraction-search-${stepId}`);
  if (input) input.focus();
}

function stepAttractionSearchQuery(stepId) {
  const input = document.getElementById(`attraction-search-${stepId}`);
  return input ? input.value.trim() : '';
}

function stepAttractionsAttached(scenarioId, stepId) {
  return (getStep(scenarioId, stepId).attractions || []).map((entry) => entry.attractionId);
}

// Un nom sans correspondance se crée sur place : l'attraction ne porte alors que son nom.
function stepAttractionOptions(scenarioId, stepId) {
  const query = stepAttractionSearchQuery(stepId);
  const matches = attractionMatches(query, stepAttractionsAttached(scenarioId, stepId));
  if (!matches.length)
    return query
      ? `<button class="inline-menu-item inline-menu-item-create"
           onclick="createStepAttractionFromCard('${scenarioId}','${stepId}')">
           ＋ Créer « ${escapeHtml(query)} »
         </button>`
      : '<div class="inline-menu-group">Aucune attraction</div>';
  return matches
    .map(
      (a) => `<button class="inline-menu-item"
        onclick="attachStepAttraction('${scenarioId}','${stepId}','${a.id}')">
        ${tagLabel(attractionType(a.type).emoji, escapeHtml(a.name))}
      </button>`,
    )
    .join('');
}

function repaintStepAttractionOptions(scenarioId, stepId) {
  document.getElementById(`attraction-options-${stepId}`).innerHTML = stepAttractionOptions(
    scenarioId,
    stepId,
  );
}

function stepAttractionSearchKeydown(e, scenarioId, stepId) {
  if (e.key !== 'Enter') return;
  e.preventDefault();
  pickFirstAttraction(
    stepAttractionSearchQuery(stepId),
    stepAttractionsAttached(scenarioId, stepId),
    (id) => attachStepAttraction(scenarioId, stepId, id),
    () => createStepAttractionFromCard(scenarioId, stepId),
  );
}

function createStepAttractionFromCard(scenarioId, stepId) {
  const name = stepAttractionSearchQuery(stepId);
  if (!name) return;
  attachStepAttraction(scenarioId, stepId, createAttractionNamed(name).id);
}
