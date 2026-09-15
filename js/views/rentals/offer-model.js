/*
  Ce qu'un véhicule est — son nom, sa motorisation, sa boîte — appartient au modèle du voyage ;
  la ligne d'une location n'en garde que la référence, et c'est ce qui rapproche la même Golf prise
  chez deux loueurs. Une voiture reprise d'avant le catalogue porte encore son nom à elle : il
  répond à défaut.
*/
function offerCarModel(offer) {
  return getCarModel(offer.modelId);
}

function offerModelName(offer) {
  const model = offerCarModel(offer);
  return model ? model.name : offer.model || '';
}

function offerWords(offer) {
  return offerCarModel(offer) || offer;
}

function offerFuelTag(offer) {
  return carFuelTag(offerWords(offer));
}

function offerGearboxTag(offer) {
  return carGearboxTag(offerWords(offer));
}
