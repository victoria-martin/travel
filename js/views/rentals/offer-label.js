// Un véhicule se nomme par son loueur et son modèle ; le loueur vit sur sa location, le nom du
// modèle sur le catalogue du voyage.
function offerLabel(offer) {
  return (
    [providerName(offerRental(offer).providerId), offerModelName(offer)]
      .filter(Boolean)
      .join(' · ') || 'Sans nom'
  );
}
