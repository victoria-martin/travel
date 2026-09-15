/*
  Le mode dit le mot : les modes à compagnie en portent une, la voiture se loue. L'article vit ici
  avec le nom — les écrans écrivent « Ajouter une compagnie » aussi bien que « un loueur ».
*/
const PROVIDER_NOUNS = {
  carrier: { label: 'Compagnie', indefinite: 'une compagnie' },
  rental: { label: 'Loueur', indefinite: 'un loueur' },
};

function providerNoun(mode) {
  return transportMode(mode).carrier ? PROVIDER_NOUNS.carrier : PROVIDER_NOUNS.rental;
}

function providerName(id) {
  const provider = getProvider(id);
  return provider ? provider.name : '';
}
