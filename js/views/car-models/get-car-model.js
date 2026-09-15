/*
  Un modèle de voiture est du voyage, pas d'un loueur : c'est ce qui permet de comparer la même
  Golf chez deux loueurs. Il ne porte que ce que la voiture EST — son nom, sa motorisation, sa
  boîte. Ce qu'elle coûte dépend du loueur et des dates, donc ça vit sur l'offre.
*/
function getCarModel(id) {
  return state.carModels.find((m) => m.id === id);
}

function travelCarModels() {
  return ofCurrentTravel(state.carModels).sort((a, b) => a.name.localeCompare(b.name));
}

function findCarModelNamed(name) {
  const needle = name.trim().toLowerCase();
  return travelCarModels().find((m) => m.name.toLowerCase() === needle);
}

// Les offres d'un modèle : un véhicule par location où on l'a relevé, loueurs mêlés.
function carModelOffers(modelId) {
  return ofCurrentTravel(state.offers).filter((offer) => offer.modelId === modelId);
}
