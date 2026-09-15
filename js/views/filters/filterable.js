/*
  Une colonne filtre dès qu'elle porte des mots : son vocabulaire, ou ceux que ses lignes tiennent.
  Un prix, une date, un favori n'en portent pas — une égalité sur un nombre ne filtre rien. Une
  colonne verrouillée nomme la ligne plutôt qu'elle ne la range, donc seul le vocabulaire qu'elle
  déclare compte.
*/
function filterableColumns(kind) {
  return columnsFor(kind).filter(
    (c) =>
      (c.filterValues || c.sortValue) &&
      (c.sortOrder || !c.locked) &&
      filterValues(kind, c).length > 1,
  );
}

function filterColumn(kind, key) {
  return columnsFor(kind).find((c) => c.key === key);
}

// Ce qu'une ligne porte sur cette colonne : un mot, ou plusieurs quand la colonne tient une liste.
function itemFilterValues(item, column) {
  const values = column.filterValues ? column.filterValues(item) : [column.sortValue(item)];
  return values.map(String);
}

// Seules les valeurs qu'une ligne porte vraiment : un statut que personne n'a ne filtrerait rien.
function filterValues(kind, column) {
  const used = new Set();
  ofCurrentTravel(listResource(kind).items()).forEach((item) =>
    itemFilterValues(item, column).forEach((value) => used.add(value)),
  );
  if (column.sortOrder) return Object.keys(column.sortOrder.dict).filter((word) => used.has(word));
  return [...used].filter((value) => value !== '').sort((a, b) => a.localeCompare(b, 'fr'));
}

function filterValueLabel(column, value) {
  const word = column.sortOrder && column.sortOrder.dict[value];
  return word ? tagLabel(word.emoji, escapeHtml(word.label)) : escapeHtml(value);
}
