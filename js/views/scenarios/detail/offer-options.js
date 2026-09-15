/*
  Les options se cochent ici et non sur l'offre : l'offre dit ce que le loueur propose, le scénario
  ce qu'on y prend. Deux scénarios comparent alors deux assurances sur la même voiture sans la
  dupliquer. Le prix affiché est celui du loueur, compté sur les jours de ce scénario.
*/
function scenarioOfferOptionsBlock(scenario) {
  const offer = getScenarioOffer(scenario);
  if (!offer) return '';
  const provider = getProvider(offerRental(offer).providerId);
  if (!provider || !provider.options.length) return '';
  const days = totalDays(scenario);
  return provider.options.map((option) => scenarioOfferOptionLine(scenario, option, days)).join('');
}

function scenarioOfferOptionLine(scenario, option, days) {
  const amount = optionAmount(option, days);
  const unit = providerOptionUnit(option.unit);
  return /* HTML */ `<label class="expense-line offer-option-line">
    <input
      type="checkbox"
      ${(scenario.offerOptionIds || []).includes(option.id) ? 'checked' : ''}
      onchange="toggleScenarioOfferOption('${scenario.id}','${option.id}')"
    />
    <span class="expense-label"
      >${escapeHtml(option.label || 'Sans libellé')}
      ${unit.suffix ? `<span class="expense-unit">${escapeHtml(`${option.amount} € ${unit.suffix}`)}</span>` : ''}</span
    >
    <strong>${formatEuros(amount)}</strong>
  </label>`;
}

function toggleScenarioOfferOption(scenarioId, optionId) {
  const scenario = getScenario(scenarioId);
  const ids = scenario.offerOptionIds || [];
  scenario.offerOptionIds = ids.includes(optionId)
    ? ids.filter((id) => id !== optionId)
    : ids.concat(optionId);
  saveNow();
  render();
}
