function getScenario(id) {
  return state.scenarios.find((s) => s.id === id);
}

function getScenarioExpenses(scenario) {
  return (scenario.costIds || []).map(getFixedCost).filter(Boolean);
}

function getScenarioTransports(scenario) {
  return (scenario.transportIds || [])
    .map((id) => state.transports.find((t) => t.id === id))
    .filter(Boolean);
}

function getScenarioOffer(scenario) {
  return scenario.offerId ? state.offers.find((c) => c.id === scenario.offerId) || null : null;
}

// Les options retenues pour ce scénario, et non celles de l'offre : deux scénarios comparent deux
// assurances sur la même voiture. Elles se lisent dans le catalogue du loueur qui la loue.
function scenarioOfferOptions(scenario) {
  const offer = getScenarioOffer(scenario);
  return offer ? providerOptions(offer.providerId, scenario.offerOptionIds) : [];
}
