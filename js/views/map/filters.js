/*
  Deux collections sur la même carte, donc deux listes de types : une case cochée dit qu'un type
  se trace. Province, favoris et scénario, eux, valent pour les deux — ce sont des questions sur
  le voyage, pas sur la collection.
*/
let mapFilters = {
  accommodationTypes: new Set([...Object.keys(ACCOMMODATION_TYPES), '']),
  attractionTypes: new Set([...Object.keys(ATTRACTION_TYPES), '']),
  counties: new Set(),
  scenarioId: null,
  favOnly: false,
};

function distinctCounties() {
  const set = new Set();
  [...ofCurrentTravel(state.accommodations), ...ofCurrentTravel(state.attractions)].forEach(
    (item) => {
      if (item.county) set.add(item.county);
    },
  );
  return Array.from(set).sort();
}

function toggleMapType(collection, key) {
  const types = mapFilters[collection];
  if (types.has(key)) types.delete(key);
  else types.add(key);
  refreshMap();
}

function toggleMapCounty(county) {
  if (mapFilters.counties.has(county)) mapFilters.counties.delete(county);
  else {
    // if nothing was excluded yet (size 0 = "all"), start explicit set with everything except it
    if (mapFilters.counties.size === 0)
      distinctCounties().forEach((c) => mapFilters.counties.add(c));
    mapFilters.counties.delete(county);
  }
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

function refreshMap() {
  render();
  setTimeout(initMap, 30);
}

function keptByCommonFilters(item) {
  const countyFilterActive = mapFilters.counties.size > 0;
  if (countyFilterActive && item.county && mapFilters.counties.has(item.county) === false)
    return false;
  return !(mapFilters.favOnly && !item.favorite);
}
