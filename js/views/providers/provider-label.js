/*
  Le mode dit le mot : une voiture se loue, les autres modes ont une compagnie. L'article vit ici
  avec le nom — les écrans écrivent « Ajouter une compagnie » aussi bien que « un loueur ».
*/
const PROVIDER_NOUNS = {
  carrier: { label: 'Compagnie', indefinite: 'une compagnie' },
  rental: { label: 'Loueur', indefinite: 'un loueur' },
};

function providerNoun(mode) {
  return mode === 'car' ? PROVIDER_NOUNS.rental : PROVIDER_NOUNS.carrier;
}

function providerName(id) {
  const provider = getProvider(id);
  return provider ? provider.name : '';
}
