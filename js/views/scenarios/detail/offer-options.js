/*
  Les options se cochent ici et non sur l'offre : l'offre dit ce que le loueur propose, le scénario
  ce qu'on y prend. Deux scénarios comparent alors deux assurances sur la même voiture sans la
  dupliquer. Le prix affiché est celui du loueur, compté sur les jours de ce scénario.
*/
function toggleScenarioOfferOption(scenarioId, optionId) {
  const scenario = getScenario(scenarioId);
  const ids = scenario.offerOptionIds || [];
  scenario.offerOptionIds = ids.includes(optionId)
    ? ids.filter((id) => id !== optionId)
    : ids.concat(optionId);
  saveNow();
  render();
}
