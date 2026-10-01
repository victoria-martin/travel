/*
  L'étape du scénario choisi où vit un hébergement ou une activité, par accommodationId, par
  attractionId de l'étape, ou par une activité posée en extra sur l'étape ou son groupe — sert la
  colonne Étape des tables Hébergements et Lieux & activités (deux consommateurs).
*/
function chosenStepForPlace({ accommodationId, attractionId } = {}) {
  const scenario = chosenScenario();
  if (!scenario) return null;
  const steps = visibleSteps(scenario);
  const index = steps.findIndex((step) =>
    stepHoldsPlace(scenario, step, accommodationId, attractionId),
  );
  if (index === -1) return null;
  return { scenario, step: steps[index], index };
}

function stepHoldsPlace(scenario, step, accommodationId, attractionId) {
  if (accommodationId) return step.accommodationId === accommodationId;
  if (!attractionId) return false;
  if (step.attractionId === attractionId) return true;
  if (holderExtras(step).some((line) => line.attractionId === attractionId)) return true;
  const group = getStepGroup(scenario, step.groupId);
  return !!group && holderExtras(group).some((line) => line.attractionId === attractionId);
}

function chosenStepCell(place) {
  const found = chosenStepForPlace(place);
  if (!found) return '—';
  return `${escapeHtml(found.scenario.name)} — ${found.index + 1}. ${stepPickerLabel(found.step)}`;
}

function chosenStepSortValue(place) {
  const found = chosenStepForPlace(place);
  return found ? found.index : Infinity;
}
