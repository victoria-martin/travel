/*
  Mêmes tags libres que les hébergements — un tag existe dès qu'il est saisi — mais amorcés par
  un vocabulaire par défaut, pour qu'une première attraction ait déjà quelque chose à proposer.
*/
const DEFAULT_ATTRACTION_TAGS = [
  'paysage',
  'village',
  'marché',
  'monument',
  'musée',
  'église',
  'jardin',
  'point de vue',
  'plage',
  'thermes',
  'randonnée',
  'artisanat',
];

function allAttractionTags() {
  const set = new Set(DEFAULT_ATTRACTION_TAGS);
  ofCurrentTravel(state.attractions).forEach((a) => (a.tags || []).forEach((tag) => set.add(tag)));
  return Array.from(set).sort((a, b) => a.localeCompare(b, 'fr'));
}
