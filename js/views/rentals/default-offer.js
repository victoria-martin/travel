// Une seule voiture par défaut : la marquer démarque les autres, la re-cliquer n'en laisse aucune.
function setDefaultOffer(id) {
  const wasDefault = !!getOffer(id).isDefault;
  ofCurrentTravel(state.offers).forEach((c) => (c.isDefault = !wasDefault && c.id === id));
  saveNow();
  render();
}

function defaultOffer() {
  return ofCurrentTravel(state.offers).find((c) => c.isDefault) || null;
}
