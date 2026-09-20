/*
  Le lien activité → scénario ne passe pas par la fiche de l'étape : depuis le formulaire du lieu,
  "Ajouter à un scénario" pose la même ligne que le champ Activités d'une étape attacherait
  (attachExtraAttraction), juste depuis l'autre bout. Une activité en cours de création (sans id)
  est enregistrée en silence au premier clic — sans fermer la modale ni perdre ce qui vient d'être
  tapé — pour que le geste marche aussi à la création, pas seulement à l'édition.
  "Ajouter au plan" saute le choix : elle rejoint le scénario choisi, à l'étape dont l'hébergement
  est géographiquement le plus proche — à vol d'oiseau, faute de route calculable hors ligne.
*/

function attractionScenarioActions() {
  return /* HTML */ `<div class="field-row">
    ${attractionScenarioDropdown()}
    <button type="button" class="btn btn-ghost" onclick="addAttractionToPlan()">
      Ajouter au plan
    </button>
  </div>`;
}

function attractionScenarioDropdown() {
  return inlineDropdown(
    'attraction-scenario',
    'attraction-scenario-dropdown',
    /* HTML */ `<summary class="btn btn-ghost attraction-scenario-trigger">
        Ajouter à un scénario
      </summary>
      <div class="inline-menu">${attractionScenarioOptions()}</div>`,
  );
}

function attractionScenarioOptions() {
  const groups = activeScenarios(ofCurrentTravel(state.scenarios))
    .map(attractionScenarioStepGroup)
    .join('');
  return groups || '<div class="inline-menu-group">Aucun scénario</div>';
}

function attractionScenarioStepGroup(scenario) {
  const steps = visibleSteps(scenario);
  if (!steps.length) return '';
  const items = steps
    .map(
      (step) => `<button type="button" class="inline-menu-item"
        onclick="attachAttractionToStep('${scenario.id}','${step.id}')">
        ${attractionStepPickerLabel(step)}
      </button>`,
    )
    .join('');
  return `<div class="inline-menu-group">${escapeHtml(scenario.name)}</div>${items}`;
}

// Même filet que placeOptionLabel : le nom de l'étape prime, son lieu ne complète que s'il a des
// niveaux de localisation.
function attractionStepPickerLabel(step) {
  const place = stepPlace(step);
  const name = step.name || (place && place.name) || 'Sans nom';
  const location = place ? placeLevelsLabel(place) : '';
  return escapeHtml(name) + (location ? ` — ${escapeHtml(location)}` : '');
}

function attachAttractionToStep(scenarioId, stepId) {
  closeOpenInlineMenu();
  const attractionId = ensureAttractionSaved();
  const step = getStep(scenarioId, stepId);
  attachExtraAttraction(scenarioId, stepId, attractionId);
  showToast(`Ajouté à « ${step.name || 'l’étape'} »`);
}

// Distance à vol d'oiseau : rien ne calcule de route hors ligne pour départager les étapes du plan.
const EARTH_RADIUS_KM = 6371;

function haversineKm([lat1, lng1], [lat2, lng2]) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a));
}

function nearestAccommodationStep(scenario, attraction) {
  const from = [parseFloat(attraction.lat), parseFloat(attraction.lng)];
  const ranked = visibleSteps(scenario)
    .map((step) => {
      const acc = step.accommodationId && getAccommodation(step.accommodationId);
      if (!acc || !acc.lat || !acc.lng) return null;
      return { step, distance: haversineKm(from, [parseFloat(acc.lat), parseFloat(acc.lng)]) };
    })
    .filter(Boolean)
    .sort((a, b) => a.distance - b.distance);
  return ranked.length ? ranked[0].step : null;
}

function addAttractionToPlan() {
  const scenario = chosenScenario();
  if (!scenario) return showToast('Aucun scénario choisi comme plan');
  const attractionId = ensureAttractionSaved();
  const attraction = getAttraction(attractionId);
  if (!attraction.lat || !attraction.lng)
    return showToast('Ce lieu n’a pas de coordonnées géographiques');
  const step = nearestAccommodationStep(scenario, attraction);
  if (!step) return showToast('Aucun hébergement localisé dans le plan');
  attachExtraAttraction(scenario.id, step.id, attractionId);
  showToast(`Ajouté à « ${step.name || 'l’étape'} »`);
}

/*
  Enregistre l'activité en cours d'édition sans fermer la modale, pour que les deux boutons
  marchent aussi bien pendant une création qu'une édition. Le bouton Enregistrer est réécrit sur
  l'id obtenu : sans ça, il resterait câblé sur l'id vide d'origine et un second clic créerait un
  doublon au lieu de mettre à jour.
*/
function ensureAttractionSaved() {
  const item = readAttractionForm(modal.payload.id);
  upsertAttraction(item);
  modal.payload = structuredClone(item);
  document.getElementById('f-save')?.setAttribute('onclick', `saveAttraction('${item.id}')`);
  modalSnapshot = modalFieldsState();
  return item.id;
}
