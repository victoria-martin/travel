/*
  Lister les étapes d'un scénario où rattacher un lieu, depuis le popup de la carte (markers.js).
  Le geste appelé prend toujours (scenarioId, stepId).
*/
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
