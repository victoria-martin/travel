// Une offre arrive avec les options déjà cochées chez le loueur : c'est le point de départ du
// scénario, qu'il reste libre de défaire.
function applyScenarioOffer(scenario, offerId) {
  scenario.offerId = offerId || null;
  scenario.offerOptionIds = offerId ? [...(getOffer(offerId).optionIds || [])] : [];
}

function setScenarioOffer(scenarioId, offerId) {
  applyScenarioOffer(getScenario(scenarioId), offerId);
  saveNow();
  render();
}
