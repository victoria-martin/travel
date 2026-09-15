function getProvider(id) {
  return state.providers.find((p) => p.id === id);
}

// Un vol ne se prend pas chez un loueur : un select ne propose que les prestataires de son mode.
function providersOfMode(mode) {
  return ofCurrentTravel(state.providers)
    .filter((p) => p.mode === mode)
    .sort((a, b) => a.name.localeCompare(b.name));
}

// Les options cochées quelque part ne sont que des références au catalogue du loueur : corriger un
// prix là-bas le corrige partout, et une option retirée du catalogue disparaît des totaux.
function providerOptions(providerId, ids) {
  const provider = getProvider(providerId);
  if (!provider) return [];
  return (ids || []).map((id) => provider.options.find((o) => o.id === id)).filter(Boolean);
}
