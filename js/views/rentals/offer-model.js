/*
  Ce qu'une voiture est — son nom, sa motorisation, sa boîte — appartient au modèle du voyage ;
  une offre n'en garde que la référence, et c'est ce qui rapproche la même Golf relevée chez deux
  loueurs. Une voiture reprise d'avant le catalogue porte encore son nom à elle : il
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
