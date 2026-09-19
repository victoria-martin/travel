function scenarioOfferBlock(scenario) {
  const offer = getScenarioOffer(scenario);
  return /* HTML */ `<div class="scenario-extra">
    <div class="scenario-extra-head">
      <div class="acc-recap-title">Voiture${offer ? offerSheetButton(offer.id) : ''}</div>
      ${offer ? `<strong>${formatEuros(scenarioOfferTotal(scenario))}</strong>` : ''}
    </div>
    ${
      ofCurrentTravel(state.offers).length === 0
        ? /* HTML */ `<div class="scenario-extra-empty">
            Aucune offre relevée — ajoute-en une depuis l'onglet Voitures.
          </div>`
        : `${scenarioOfferDropdown(scenario)}${offer ? scenarioOfferBaseLine(scenario, offer) : ''}${scenarioOfferOptionsBlock(scenario)}`
    }
  </div>`;
}

// Le prix de base, options exclues : sans lui, la seule trace du prix/jour de l'offre était le
// total du bloc, dont rien ne disait s'il l'incluait déjà ou non.
function scenarioOfferBaseLine(scenario, offer) {
  const days = totalDays(scenario);
  const price = offerDayPrice(offer);
  const note = price ? `${offerDayPriceLabel(offer)} × ${days} j` : 'prix par jour non renseigné';
  return /* HTML */ `<div class="expense-line">
    <span class="expense-label">Location<span class="expense-unit">${escapeHtml(note)}</span></span>
    <strong>${price ? formatEuros(price * days) : '—'}</strong>
  </div>`;
}

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
