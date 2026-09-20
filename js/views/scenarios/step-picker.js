/*
  Lister les étapes où rattacher quelque chose — un lieu, un point d'itinéraire — groupées par
  scénario, deux appelants (attractions/modal/add-to-scenario.js, map/route-to-scenario.js).
  Le geste appelé prend toujours (scenarioId, stepId), comme attachAttractionToStep/addRouteToStep.
*/
function scenarioStepPickerGroups(onPick, extraArgs = '') {
  const groups = activeScenarios(ofCurrentTravel(state.scenarios))
    .map((scenario) => scenarioStepPickerGroup(scenario, onPick, extraArgs))
    .join('');
  return groups || '<div class="inline-menu-group">Aucun scénario</div>';
}

function scenarioStepPickerGroup(scenario, onPick, extraArgs) {
  const steps = visibleSteps(scenario);
  if (!steps.length) return '';
  const items = steps
    .map(
      (step) => `<button type="button" class="inline-menu-item"
        onclick="${onPick}('${scenario.id}','${step.id}'${extraArgs})">
        ${stepPickerLabel(step)}
      </button>`,
    )
    .join('');
  return `<div class="inline-menu-group">${escapeHtml(scenario.name)}</div>${items}`;
}

// Même filet que placeOptionLabel : le nom de l'étape prime, son lieu ne complète que s'il a des
// niveaux de localisation.
function stepPickerLabel(step) {
  const place = stepPlace(step);
  const name = step.name || (place && place.name) || 'Sans nom';
  const location = place ? placeLevelsLabel(place) : '';
  return escapeHtml(name) + (location ? ` — ${escapeHtml(location)}` : '');
}
