/*
  Un filtre est une pile de niveaux : une colonne, et les mots qu'on y garde. OU dans un niveau,
  ET entre niveaux — « les Airbnb et les hôtels, en Toscane ». L'ordre des niveaux ne change rien
  au résultat, ils se cumulent tous : il n'y a donc rien à y ranger.
  L'état est le geste en cours et non une préférence qu'on retrouve, comme le mode comparer des
  scénarios. Il vit par **écran** et non par collection : filtrer la carte ne filtre pas la page,
  et l'écran dit en plus quelle ressource il lit — la sienne, ou celle qu'on y choisit.
*/
let filters = {};

function filterState(scope) {
  if (!filters[scope]) filters[scope] = { kind: scope, levels: [] };
  return filters[scope];
}

function filterKind(scope) {
  return filterState(scope).kind;
}

// Changer de ressource jette les niveaux : ils portaient les colonnes de celle qu'on quitte.
function setFilterKind(scope, kind) {
  filters[scope] = { kind, levels: [] };
  render();
}

function filterLevels(scope) {
  return filterState(scope).levels;
}

function setFilterLevels(scope, levels) {
  filterState(scope).levels = levels;
  render();
}

function addFilterLevel(scope) {
  const used = filterLevels(scope).map((l) => l.key);
  const next = filterableColumns(filterKind(scope)).find((c) => !used.includes(c.key));
  if (!next) return;
  setFilterLevels(scope, [...filterLevels(scope), { key: next.key, values: [] }]);
}

// Deux niveaux sur la même colonne diraient deux fois la même chose : celui d'avant s'efface.
function setFilterLevelColumn(scope, index, key) {
  setFilterLevels(
    scope,
    filterLevels(scope)
      .map((level, i) => (i === index ? { key, values: [] } : level))
      .filter((level, i) => i === index || level.key !== key),
  );
}

function toggleFilterValue(scope, index, valueIndex) {
  const level = filterLevels(scope)[index];
  const kind = filterKind(scope);
  const value = filterValues(kind, filterColumn(kind, level.key))[valueIndex];
  const values = level.values.includes(value)
    ? level.values.filter((v) => v !== value)
    : [...level.values, value];
  setFilterLevels(
    scope,
    filterLevels(scope).map((l, i) => (i === index ? { ...l, values } : l)),
  );
}

function removeFilterLevel(scope, index) {
  setFilterLevels(
    scope,
    filterLevels(scope).filter((level, i) => i !== index),
  );
}

// Un niveau sans mot coché ne filtre rien : il attend qu'on en coche un, il ne se compte pas.
function activeFilterCount(scope) {
  return filterLevels(scope).filter((level) => level.values.length).length;
}

function keptByFilters(scope, item) {
  const kind = filterKind(scope);
  return filterLevels(scope).every((level) => {
    if (!level.values.length) return true;
    const column = filterColumn(kind, level.key);
    if (!column) return true;
    return itemFilterValues(item, column).some((value) => level.values.includes(value));
  });
}

/*
  Une valeur cochée puis retirée de sa dernière ligne filtrerait sur ce que plus rien ne montre, et
  une colonne masquée du picker reste filtrable — c'est la liste qui la porte, pas le tableau.
*/
function pruneFilterLevels(scope) {
  const kind = filterKind(scope);
  const levels = filterLevels(scope)
    .filter((level) => filterColumn(kind, level.key))
    .map((level) => {
      const available = filterValues(kind, filterColumn(kind, level.key));
      return { ...level, values: level.values.filter((value) => available.includes(value)) };
    });
  filterState(scope).levels = levels;
}
