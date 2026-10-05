/*
  What the React map still reads from here: the accommodations of a chosen scenario, and the
  "add to a scenario" actions written into an attraction popup (attractionPopup.ts).
*/
function scenarioAccommodationIds(scenario) {
  return new Set(
    visibleSteps(scenario)
      .map((step) => step.accommodationId)
      .filter(Boolean),
  );
}

function mapAttractionScenarioActions(attractionId) {
  const currentScenario = mapAttractionCurrentScenario();
  return `${currentScenario ? mapAttractionCurrentActions(attractionId, currentScenario) : ''}
    ${mapAttractionOtherScenarioActions(attractionId, currentScenario)}`;
}

function attachMapAttractionToStep(scenarioId, stepId, attractionId) {
  closeOpenInlineMenu();
  const attraction = getAttraction(attractionId);
  if (!attraction) return;
  const step = getStep(scenarioId, stepId);
  attachExtraAttraction(scenarioId, stepId, attraction.id);
  showToast(`Ajouté à « ${step.name || 'l’étape'} »`);
}

function addMapAttractionAutomatically(scenarioId, attractionId) {
  const scenario = getScenario(scenarioId);
  if (!scenario) return;
  const attraction = getAttraction(attractionId);
  if (!attraction) return;
  const step = nearestAccommodationStep(scenario, attraction);
  if (!step) return showToast('Aucun hébergement localisé dans ce scénario');
  attachExtraAttraction(scenario.id, step.id, attractionId);
  showToast(`Ajouté à « ${step.name || 'l’étape'} »`);
}

function mapAttractionCurrentScenario() {
  if (view === 'scenario-detail') return getScenario(activeScenarioId);
  return mapFilters.scenarioId ? getScenario(mapFilters.scenarioId) : chosenScenario();
}

function mapAttractionCurrentActions(attractionId, scenario) {
  const extraArgs = `,'${attractionId}'`;
  const steps = scenarioStepPickerGroup(scenario, 'attachMapAttractionToStep', extraArgs);
  return `${inlineDropdown(
    `map-attraction-step:${attractionId}:${scenario.id}`,
    'map-popup-dropdown',
    `<summary class="map-popup-action">Ajouter à une étape</summary>
      <div class="inline-menu">${steps || '<div class="inline-menu-group">Aucune étape</div>'}</div>`,
  )}
  <button type="button" class="map-popup-action"
    onclick="addMapAttractionAutomatically('${scenario.id}','${attractionId}')">
    Ajouter automatiquement
  </button>`;
}

function mapAttractionOtherScenarioActions(attractionId, currentScenario) {
  const scenarios = activeScenarios(ofCurrentTravel(state.scenarios)).filter(
    (scenario) => scenario.id !== currentScenario?.id,
  );
  if (!scenarios.length) return '';
  const selected = scenarios[0];
  return inlineDropdown(
    `map-attraction-other-scenario:${attractionId}`,
    'map-popup-dropdown',
    `<summary class="map-popup-action">Ajouter à un autre scénario</summary>
      <div class="inline-menu map-other-scenario-menu">
        <select class="map-scenario-select"
          onchange="setMapAttractionScenario('${attractionId}', this.value)">
          ${scenarios
            .map(
              (scenario) =>
                `<option value="${scenario.id}" ${scenario.id === selected.id ? 'selected' : ''}>
                  ${escapeHtml(scenario.name)}
                </option>`,
            )
            .join('')}
        </select>
        <div id="map-attraction-scenarios-${attractionId}">
          ${scenarios
            .map((scenario, index) => mapAttractionScenarioPanel(attractionId, scenario, index > 0))
            .join('')}
        </div>
      </div>`,
  );
}

function mapAttractionScenarioPanel(attractionId, scenario, hidden) {
  const extraArgs = `,'${attractionId}'`;
  const steps = scenarioStepPickerGroup(scenario, 'attachMapAttractionToStep', extraArgs);
  return `<div data-map-attraction-scenario="${scenario.id}" ${hidden ? 'hidden' : ''}>
    <div class="inline-menu-group">Ajouter à une étape</div>
    ${steps || '<div class="inline-menu-group">Aucune étape</div>'}
    <button type="button" class="map-popup-action"
      onclick="addMapAttractionAutomatically('${scenario.id}','${attractionId}')">
      Ajouter automatiquement
    </button>
  </div>`;
}

function setMapAttractionScenario(attractionId, scenarioId) {
  const menu = document.getElementById(`map-attraction-scenarios-${attractionId}`);
  if (!menu) return;
  menu.querySelectorAll('[data-map-attraction-scenario]').forEach((panel) => {
    panel.hidden = panel.dataset.mapAttractionScenario !== scenarioId;
  });
}
