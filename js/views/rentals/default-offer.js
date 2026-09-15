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

function defaultOfferCell(offer) {
  return /* HTML */ `<button
    class="icon-btn"
    style="border:none; font-size:15px; flex-shrink:0; color:${
      offer.isDefault ? '#C98A3E' : 'var(--line)'
    };"
    onclick="setDefaultOffer('${offer.id}')"
    title="${offer.isDefault ? 'Ne plus être la voiture par défaut' : 'Voiture par défaut'}"
  >
    ${svgIcon(offer.isDefault ? 'circle-dot' : 'circle')}
  </button>`;
}
