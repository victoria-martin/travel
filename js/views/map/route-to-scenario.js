/*
  Envoyer l'itinéraire tracé sur la carte vers un scénario : un lieu/une ville s'attache comme
  extra à une étape (attachExtraAttraction, comme depuis la fiche d'un lieu) ; un hébergement ne
  peut pas être un extra, donc dès qu'il y en a un dans l'itinéraire on ouvre le choix
  (route-accommodation-modal.js). Deux points d'entrée, sur le patron de add-to-scenario.js :
  choisir un scénario + une étape, ou rejoindre le plan (chosenScenario) où chaque point trouve
  seul l'étape dont l'hébergement est le plus proche.
*/

function routeScenarioActions() {
  return /* HTML */ `<div class="field-row">
    ${routeScenarioDropdown()}
    <button type="button" class="btn btn-ghost" onclick="addRouteToPlan()">Ajouter au plan</button>
  </div>`;
}

function routeScenarioDropdown() {
  return inlineDropdown(
    'route-scenario',
    'route-scenario-dropdown',
    /* HTML */ `<summary class="btn btn-ghost attraction-scenario-trigger">
        Ajouter à un scénario
      </summary>
      <div class="inline-menu">${scenarioStepPickerGroups('addRouteToStep')}</div>`,
  );
}

function routeBuilderPointsByKind() {
  return {
    attraction: routeBuilder.points.filter((p) => p.kind === 'attraction'),
    ville: routeBuilder.points.filter((p) => p.kind === 'ville'),
    accommodation: routeBuilder.points.filter((p) => p.kind === 'accommodation'),
  };
}

function addRouteToStep(scenarioId, stepId) {
  closeOpenInlineMenu();
  const { attraction, ville, accommodation } = routeBuilderPointsByKind();
  attraction.forEach((p) => attachExtraAttraction(scenarioId, stepId, p.id));
  reportSkippedVilles(ville);
  if (accommodation.length) {
    openRouteAccommodationChoice(scenarioId, stepId, accommodation);
  } else if (attraction.length) {
    showToast(routePointsAddedMessage(attraction.length));
  }
}

function addRouteToPlan() {
  const scenario = chosenScenario();
  if (!scenario) return showToast('Aucun scénario choisi comme plan');
  const { attraction, ville, accommodation } = routeBuilderPointsByKind();
  let attached = 0;
  attraction.forEach((p) => {
    const step = nearestAccommodationStep(scenario, p);
    if (step) {
      attachExtraAttraction(scenario.id, step.id, p.id);
      attached++;
    }
  });
  reportSkippedVilles(ville);
  if (accommodation.length) {
    openRouteAccommodationChoice(scenario.id, null, accommodation);
  } else if (attached) {
    showToast(routePointsAddedMessage(attached));
  } else if (attraction.length) {
    showToast('Aucun hébergement localisé dans le plan');
  }
}

function reportSkippedVilles(villePoints) {
  if (villePoints.length) showToast('Les villes ne s’ajoutent pas encore à une étape');
}

function routePointsAddedMessage(count) {
  return count > 1 ? `${count} lieux ajoutés à l’étape` : 'Ajouté à l’étape';
}
