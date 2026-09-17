// Une offre se nomme par son loueur et son modèle ; le modèle vit dans le catalogue du voyage.
function offerLabel(offer) {
  return (
    [providerName(offer.providerId), offerModelName(offer)].filter(Boolean).join(' · ') ||
    'Sans nom'
  );
}
