/*
  On choisit une voiture comme on l'a relevée : chez un loueur. Le menu se range donc par loueur et
  non à plat, et chaque offre porte ce qu'elle coûtera sur les jours de ce scénario — options
  exclues, elles se cochent après.
*/
function pickScenarioOffer(scenarioId, offerId) {
  openInlineMenu = null;
  setScenarioOffer(scenarioId, offerId);
}

function scenarioOfferDropdown(scenario) {
  const providers = providersOfMode('car');
  const current = getScenarioOffer(scenario);
  return inlineDropdown(
    `offer:${scenario.id}`,
    'car-dropdown',
    /* HTML */ `<summary class="inline-tag">
        ${tagLabel('', current ? escapeHtml(offerLabel(current)) : 'Aucune voiture')}
      </summary>
      <div class="inline-menu">
        ${current ? openResourceMenuItem(`openOfferSheet('${current.id}')`) : ''}
        ${scenarioOfferNoneItem(scenario)}
        ${providers.map((provider) => scenarioOfferProviderGroup(scenario, provider)).join('')}
        ${scenarioOfferCreateItem(scenario)}
      </div>`,
  );
}

// La voiture qui manque se relève sans quitter le scénario : la modale garde le scénario, qui
// adopte l'offre à l'enregistrement.
function scenarioOfferCreateItem(scenario) {
  return /* HTML */ `<button
    class="inline-menu-item inline-menu-item-create"
    onclick="addScenarioOffer('${scenario.id}')"
  >
    ${svgIcon('plus')} Ajouter une voiture
  </button>`;
}

function addScenarioOffer(scenarioId) {
  openInlineMenu = null;
  openModal('voiture', '', scenarioId);
}

function scenarioOfferNoneItem(scenario) {
  return /* HTML */ `<button
    class="inline-menu-item ${scenario.offerId ? '' : 'selected'}"
    onclick="pickScenarioOffer('${scenario.id}','')"
  >
    Aucune voiture
  </button>`;
}

function scenarioOfferProviderGroup(scenario, provider) {
  const offers = ofCurrentTravel(state.offers).filter((offer) => offer.providerId === provider.id);
  if (!offers.length) return '';
  return /* HTML */ `<div class="inline-menu-group">${escapeHtml(provider.name)}</div>
    ${offers.map((offer) => scenarioOfferItem(scenario, offer)).join('')}`;
}

function scenarioOfferItem(scenario, offer) {
  const cost = offerDayPrice(offer) * totalDays(scenario);
  const dates = offerDatesLabel(offer).join(' · ');
  return /* HTML */ `<button
    class="inline-menu-item ${scenario.offerId === offer.id ? 'selected' : ''}"
    onclick="pickScenarioOffer('${scenario.id}','${offer.id}')"
  >
    <span class="inline-label">
      ${escapeHtml(offerModelName(offer) || 'Sans modèle')}${dates ? ` — ${escapeHtml(dates)}` : ''}
    </span>
    ${cost ? `<span class="inline-menu-aside">${formatEuros(cost)}</span>` : ''}
  </button>`;
}
