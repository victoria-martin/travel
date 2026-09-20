/*
  Un hébergement de l'itinéraire ne peut pas être un extra (attachExtraAttraction ne porte que des
  attractions) : il doit devenir une étape quelque part, ce qui demande de trancher où — sur le
  patron de dismissAsk/askNewWord, une question posée par-dessus l'écran sans passer par le
  système de modale d'édition (rien à enregistrer/annuler ici, juste un choix immédiat).
*/
let routeAccommodationAsk = null;
let routeAccommodationPoints = [];

function openRouteAccommodationChoice(scenarioId, stepId, points) {
  if (routeAccommodationAsk) return;
  routeAccommodationPoints = points;
  routeAccommodationAsk = document.createElement('div');
  routeAccommodationAsk.className = 'overlay overlay-ask';
  routeAccommodationAsk.onclick = (e) => {
    if (e.target === routeAccommodationAsk) closeRouteAccommodationChoice();
  };
  routeAccommodationAsk.innerHTML = routeAccommodationAskForm(scenarioId, stepId, points);
  document.getElementById('app').appendChild(routeAccommodationAsk);
}

function routeAccommodationAskForm(scenarioId, stepId, points) {
  const step = stepId ? getStep(scenarioId, stepId) : null;
  const canReplace = points.length === 1 && step;
  return /* HTML */ `<div class="modal modal-ask route-acc-ask">
    <h3>
      ${points.length > 1
        ? `${points.length} hébergements dans l’itinéraire`
        : 'Un hébergement dans l’itinéraire'}
    </h3>
    <div class="route-acc-choice">
      <label>
        <input
          type="radio"
          name="route-acc-choice"
          value="new-step"
          checked
          onchange="updateRouteAccommodationChoice()"
        />
        Créer ${points.length > 1 ? 'de nouvelles étapes' : 'une nouvelle étape'}
      </label>
      ${canReplace
        ? `<label>
            <input type="radio" name="route-acc-choice" value="replace" onchange="updateRouteAccommodationChoice()" />
            Remplacer l’hébergement de « ${escapeHtml(step.name || 'l’étape')} »
          </label>`
        : ''}
      <label>
        <input
          type="radio"
          name="route-acc-choice"
          value="new-scenario"
          onchange="updateRouteAccommodationChoice()"
        />
        Créer un nouveau scénario
      </label>
    </div>
    <div class="field" id="route-scenario-source-field" hidden>
      <label>À partir de</label>
      <select id="route-scenario-source">
        <option value="">Scénario vierge</option>
        ${activeScenarios(ofCurrentTravel(state.scenarios))
          .map(
            (s) =>
              `<option value="${s.id}" ${s.id === scenarioId ? 'selected' : ''}>Dupliquer « ${escapeHtml(s.name)} »</option>`,
          )
          .join('')}
      </select>
    </div>
    <div class="modal-actions">
      <button class="btn btn-ghost" onclick="closeRouteAccommodationChoice()">Annuler</button>
      <button class="btn" onclick="confirmRouteAccommodationChoice('${scenarioId}','${stepId || ''}')">
        Valider
      </button>
    </div>
  </div>`;
}

function updateRouteAccommodationChoice() {
  const value = routeAccommodationAsk.querySelector('input[name="route-acc-choice"]:checked').value;
  routeAccommodationAsk.querySelector('#route-scenario-source-field').hidden = value !== 'new-scenario';
}

function closeRouteAccommodationChoice() {
  routeAccommodationAsk.remove();
  routeAccommodationAsk = null;
  routeAccommodationPoints = [];
}

function confirmRouteAccommodationChoice(scenarioId, stepId) {
  const choice = routeAccommodationAsk.querySelector('input[name="route-acc-choice"]:checked').value;
  const points = routeAccommodationPoints;
  if (choice === 'new-step') {
    addAccommodationSteps(scenarioId, points);
  } else if (choice === 'replace') {
    getStep(scenarioId, stepId).accommodationId = points[0].id;
    saveNow();
  } else {
    const sourceId = document.getElementById('route-scenario-source').value;
    const targetId = sourceId ? duplicateScenario(sourceId) : createBlankScenario();
    addAccommodationSteps(targetId, points);
  }
  closeRouteAccommodationChoice();
  showToast(routeAccommodationDoneMessage(choice, points.length));
  render();
}

function addAccommodationSteps(scenarioId, points) {
  const scenario = getScenario(scenarioId);
  points.forEach((p) => {
    scenario.steps.push({ ...emptyStep(), id: uid(), name: p.name, accommodationId: p.id, nights: 1 });
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
