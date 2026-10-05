/*
  Un hébergement de l'itinéraire ne peut pas être un extra (attachExtraAttraction ne porte que des
  attractions) : il doit devenir une étape quelque part, ce qui demande de trancher où — sur le
  patron d'askNewWord, une question posée par-dessus l'écran (RouteAccommodationForm, React) sans
  passer par le système de modale d'édition : rien à enregistrer/annuler ici, juste un choix.
*/
function openRouteAccommodationChoice(scenarioId, stepId, points) {
  if (activeAsk) return;
  activeAsk = { kind: 'routeAccommodation', scenarioId, stepId, points, onClose: closeAskOverlay };
  render();
}

// choice: 'new-step' | 'replace' | 'new-scenario' (from sourceId, or blank when empty).
function applyRouteAccommodationChoice(scenarioId, stepId, points, choice, sourceId) {
  if (choice === 'new-step') {
    addAccommodationSteps(scenarioId, points);
  } else if (choice === 'replace') {
    getStep(scenarioId, stepId).accommodationId = points[0].id;
    saveNow();
  } else {
    const targetId = sourceId ? duplicateScenario(sourceId) : createBlankScenario();
    addAccommodationSteps(targetId, points);
  }
  showToast(routeAccommodationDoneMessage(choice, points.length));
  render();
}

function addAccommodationSteps(scenarioId, points) {
  const scenario = getScenario(scenarioId);
  points.forEach((p) => {
    scenario.steps.push({
      ...emptyStep(),
      id: uid(),
      name: p.name,
      accommodationId: p.id,
      nights: 1,
    });
  });
  saveNow();
}

function createBlankScenario() {
  const s = blankScenario();
  state.scenarios.push(s);
  saveNow();
  return s.id;
}

function routeAccommodationDoneMessage(choice, count) {
  if (choice === 'replace') return 'Hébergement remplacé';
  if (choice === 'new-scenario') return 'Nouveau scénario créé';
  return count > 1 ? `${count} étapes créées` : 'Étape créée';
}
