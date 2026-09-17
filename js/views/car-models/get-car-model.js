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

/*
  Les offres d'un modèle : une par relevé, loueurs mêlés. Le moins cher par jour
  ouvre la liste — c'est ce qu'on vient comparer — et une offre sans prix la ferme.
*/
function carModelOffers(modelId) {
  return ofCurrentTravel(state.offers)
    .filter((offer) => offer.modelId === modelId)
    .sort(compareOfferDayPrices);
}

function compareOfferDayPrices(a, b) {
  const [dayA, dayB] = [offerDayPrice(a), offerDayPrice(b)];
  if (!dayA || !dayB) return (dayA ? 0 : 1) - (dayB ? 0 : 1);
  return dayA - dayB;
}

/*
  Les loueurs d'un modèle, miroir de providerCarModels : ceux qui l'ont coché dans leur fiche et
  ceux chez qui on a relevé une offre dessus. Le fait « ce loueur propose ce modèle » s'écrit des
  deux côtés, il se dérive donc des deux côtés.
*/
function carModelProviders(modelId) {
  const withOffer = new Set(
    ofCurrentTravel(state.offers)
      .filter((offer) => offer.modelId === modelId)
      .map((offer) => offer.providerId),
  );
  return ofCurrentTravel(state.providers).filter(
    (provider) => (provider.modelIds || []).includes(modelId) || withOffer.has(provider.id),
  );
}
