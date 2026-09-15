function getProvider(id) {
  return state.providers.find((p) => p.id === id);
}

// Un vol ne se prend pas chez un loueur : un select ne propose que les prestataires de son mode.
function providersOfMode(mode) {
  return ofCurrentTravel(state.providers)
    .filter((p) => p.mode === mode)
    .sort((a, b) => a.name.localeCompare(b.name));
}
