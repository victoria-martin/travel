/*
  Un filtre est une pile de niveaux : une colonne, et les mots qu'on y garde. OU dans un niveau,
  ET entre niveaux — « les Airbnb et les hôtels, en Toscane ». L'ordre des niveaux ne change rien
  au résultat, ils se cumulent tous : il n'y a donc rien à y ranger.
  C'est une préférence comme le tri, pas le geste en cours : elle survit au rechargement, dans
  prefs.filters — par écran (filtrer la carte ne filtre pas la page), pas par collection.
  Une colonne fraîchement cochée part avec `values: 'all'` — toutes ses valeurs, sans les
  énumérer — pour qu'une valeur qui apparaît plus tard dans les données reste incluse ; le niveau
  ne bascule vers un tableau explicite qu'au premier décochage, qui fige la sélection.
*/
const filterScopeKinds = {};

// La carte a un scope par collection tracée, distinct du kind qu'il lit — la liste s'auto-mappe.
function registerFilterScope(scope, kind) {
  filterScopeKinds[scope] = kind;
}

function filterState(scope) {
  if (!prefs.filters[scope]) {
    const kind = filterScopeKinds[scope] || scope;
    prefs.filters[scope] = {
      kind,
      levels: filterableColumns(kind).map((c) => ({ key: c.key, values: 'all' })),
    };
  }
  return prefs.filters[scope];
}

function filterKind(scope) {
  return filterState(scope).kind;
}

function filterLevels(scope) {
  return filterState(scope).levels;
}

function setFilterLevels(scope, levels) {
  filterState(scope).levels = levels;
  persistPrefs();
  render();
}

// Ce qu'un niveau garde vraiment : la liste explicite, ou toutes les valeurs derrière le sentinel.
function levelValues(kind, level) {
  return level.values === 'all' ? filterValues(kind, filterColumn(kind, level.key)) : level.values;
}

// Une colonne cochée dans le multi-select devient un niveau à `'all'`, décochée elle disparaît.
function toggleFilterLevel(scope, key) {
  const levels = filterLevels(scope);
  setFilterLevels(
    scope,
    levels.some((l) => l.key === key)
      ? levels.filter((l) => l.key !== key)
      : [...levels, { key, values: 'all' }],
  );
}

function setAllFilterLevels(scope, checked) {
  setFilterLevels(
    scope,
    checked ? filterableColumns(filterKind(scope)).map((c) => ({ key: c.key, values: 'all' })) : [],
  );
}

function toggleFilterValue(scope, index, valueIndex) {
  const kind = filterKind(scope);
  const level = filterLevels(scope)[index];
  const allValues = filterValues(kind, filterColumn(kind, level.key));
  const current = levelValues(kind, level);
  const value = allValues[valueIndex];
  const values = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
  setFilterLevels(
    scope,
    filterLevels(scope).map((l, i) => (i === index ? { ...l, values } : l)),
  );
}

// « Tout cocher » du menu des valeurs porte sur toutes les colonnes actives à la fois.
function setAllFilterValuesEverywhere(scope, checked) {
  setFilterLevels(
    scope,
    filterLevels(scope).map((l) => ({ ...l, values: checked ? 'all' : [] })),
  );
}

// Un niveau sans valeur cochée ne garde rien : il exclut tout, il ne se compte pas comme « tous ».
function activeFilterCount(scope) {
  return filterLevels(scope).filter((level) => level.values !== 'all').length;
}

function keptByFilters(scope, item) {
  const kind = filterKind(scope);
  return filterLevels(scope).every((level) => {
    if (level.values === 'all') return true;
    const column = filterColumn(kind, level.key);
    if (!column) return true;
    return itemFilterValues(item, column).some((value) => level.values.includes(value));
  });
}

/*
  Une valeur cochée puis retirée de sa dernière ligne filtrerait sur ce que plus rien ne montre, et
  une colonne masquée du picker reste filtrable — c'est la liste qui la porte, pas le tableau. Le
  sentinel `'all'` n'a rien à élaguer, il suit les données de lui-même.
*/
function pruneFilterLevels(scope) {
  const kind = filterKind(scope);
  const levels = filterLevels(scope)
    .filter((level) => filterColumn(kind, level.key))
    .map((level) => {
      if (level.values === 'all') return level;
      const available = filterValues(kind, filterColumn(kind, level.key));
      return { ...level, values: level.values.filter((value) => available.includes(value)) };
    });
  filterState(scope).levels = levels;
}
