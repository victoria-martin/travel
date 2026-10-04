/*
  Le lien activité → scénario ne passe pas par la fiche de l'étape : depuis le formulaire du lieu,
  "Ajouter à un scénario" pose la même ligne que le champ Activités d'une étape attacherait
  (attachExtraAttraction), juste depuis l'autre bout. Une activité en cours de création (sans id)
  est enregistrée en silence au premier clic — sans fermer la modale ni perdre ce qui vient d'être
  tapé — pour que le geste marche aussi à la création, pas seulement à l'édition.
  "Ajouter au plan" saute le choix : elle rejoint le scénario choisi, à l'étape dont l'hébergement
  est géographiquement le plus proche (nearestAccommodationStep).
*/

function attachAttractionToStep(scenarioId, stepId) {
  closeOpenInlineMenu();
  const attractionId = ensureAttractionSaved();
  const step = getStep(scenarioId, stepId);
  attachExtraAttraction(scenarioId, stepId, attractionId);
  showToast(`Ajouté à « ${step.name || 'l’étape'} »`);
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
  marchent aussi bien pendant une création qu'une édition. Le bouton Enregistrer (AttractionModal)
  lit l'id dans modal.payload au clic : il met à jour celle qu'on vient de créer.
*/
function ensureAttractionSaved() {
  const item = readAttractionForm(modal.payload.id);
  upsertAttraction(item);
  modal.payload = structuredClone(item);
  modalSnapshot = modalFieldsState();
  return item.id;
}
