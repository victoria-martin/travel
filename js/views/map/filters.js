/*
  Deux collections sur la même carte, donc un jeu de niveaux par collection : on règle celle qu'on
  déplie, l'autre reste tracée avec les siens. Une case dit si elle est à l'écran — c'est elle qui
  donne « que les Airbnb en Toscane », sans avoir à décocher le reste type par type.
  Favoris et scénario, eux, valent pour les deux : ce sont des questions sur le voyage et non sur
  une colonne.
*/
const MAP_KINDS = ['hebergements', 'attractions'];

function mapScope(kind) {
  return `carte:${kind}`;
}

// Chaque collection tracée a son écran de filtre, posé sur ses propres colonnes.
MAP_KINDS.forEach((kind) => (filters[mapScope(kind)] = { kind, levels: [] }));

let mapFilters = {
  shown: { hebergements: true, attractions: true },
  scenarioId: null,
  favOnly: false,
};

function toggleMapKind(kind) {
  mapFilters.shown[kind] = !mapFilters.shown[kind];
  refreshMap();
}

function toggleMapFavOnly() {
  mapFilters.favOnly = !mapFilters.favOnly;
  refreshMap();
}

function setMapScenario(id) {
  mapFilters.scenarioId = id || null;
  refreshMap();
}

// renderMain redessine déjà la carte après chaque rendu de la vue : un seul render suffit.
function refreshMap() {
  render();
}

function keptOnMap(kind, item) {
  if (!mapFilters.shown[kind]) return false;
  if (mapFilters.favOnly && !item.favorite) return false;
  return keptByFilters(mapScope(kind), item);
}
