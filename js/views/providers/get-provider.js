function getProvider(id) {
  return state.providers.find((p) => p.id === id);
}

// Un vol ne se prend pas chez un loueur : un select ne propose que les prestataires de son mode —
// sauf mode pas encore choisi, où filtrer par une valeur vide ne montrerait plus personne.
function providersOfMode(mode) {
  return ofCurrentTravel(state.providers)
    .filter((p) => !mode || p.mode === mode)
    .sort((a, b) => a.name.localeCompare(b.name));
}

// Les options cochées quelque part ne sont que des références au catalogue du loueur : corriger un
// prix là-bas le corrige partout, et une option retirée du catalogue disparaît des totaux.
function providerOptions(providerId, ids) {
  const provider = getProvider(providerId);
  if (!provider) return [];
  return (ids || []).map((id) => provider.options.find((o) => o.id === id)).filter(Boolean);
}

/*
  Les modèles qu'un loueur propose : ceux qu'on a cochés dans sa fiche et ceux qu'on a relevés chez
  lui. Une offre est une preuve plus forte qu'une case à cocher, donc elle compte aussi — les deux
  ne peuvent plus se contredire, et rien n'a à réécrire la fiche quand une offre arrive. Le modèle
  reste du voyage : le loueur n'en tient que la référence, sans quoi la même Golf relevée chez deux
  loueurs redeviendrait deux voitures.
*/
function providerCarModels(providerId) {
  if (!providerId) return travelCarModels();
  const provider = getProvider(providerId);
  if (!provider) return [];
  const ids = new Set((provider.modelIds || []).concat(providerOfferModelIds(providerId)));
  return travelCarModels().filter((model) => ids.has(model.id));
}

function providerOfferModelIds(providerId) {
  return ofCurrentTravel(state.offers)
    .filter((offer) => offer.providerId === providerId)
    .map((offer) => offer.modelId)
    .filter(Boolean);
}
