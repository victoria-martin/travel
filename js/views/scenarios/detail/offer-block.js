function scenarioOfferBlock(scenario) {
  const offer = getScenarioOffer(scenario);
  return /* HTML */ `<div class="scenario-extra">
    <div class="scenario-extra-head">
      <div class="acc-recap-title">Voiture</div>
      ${offer ? `<strong>${formatEuros(scenarioOfferTotal(scenario))}</strong>` : ''}
    </div>
    ${
      ofCurrentTravel(state.offers).length === 0
        ? /* HTML */ `<div class="scenario-extra-empty">
            Aucune voiture relevée — commence par une location sur la page Locations.
          </div>`
        : `${scenarioOfferDropdown(scenario)}${scenarioOfferOptionsBlock(scenario)}`
    }
  </div>`;
}

// Une offre arrive avec les options déjà cochées chez le loueur : c'est le point de départ du
// scénario, qu'il reste libre de défaire.
function setScenarioOffer(scenarioId, offerId) {
  const scenario = getScenario(scenarioId);
  scenario.offerId = offerId || null;
  scenario.offerOptionIds = offerId ? [...(getOffer(offerId).optionIds || [])] : [];
  saveNow();
  render();
}
