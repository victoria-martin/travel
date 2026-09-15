/*
  A column filters when it carries words: its own vocabulary, or the words its items hold. A price,
  a date, a favourite carry none — an equality on a number filters nothing. A locked column names
  a row rather than ranking it, so only the vocabulary it may declare counts.
*/
function todoFilterColumns(kind) {
  return columnsFor(kind).filter(
    (c) => c.sortValue && (c.sortOrder || !c.locked) && todoFilterValues(kind, c).length > 1,
  );
}

// Only the values an item really holds: a status nobody carries would filter nothing.
function todoFilterValues(kind, column) {
  const used = new Set(
    ofCurrentTravel(todoResource(kind).items()).map((item) => column.sortValue(item)),
  );
  if (column.sortOrder) return Object.keys(column.sortOrder.dict).filter((word) => used.has(word));
  return [...used]
    .filter((value) => typeof value === 'string' && value !== '')
    .sort((a, b) => a.localeCompare(b, 'fr'));
}

function todoColumn(kind, columnKey) {
  return columnsFor(kind).find((c) => c.key === columnKey);
}

function todoValueLabel(column, value) {
  const word = column.sortOrder && column.sortOrder.dict[value];
  return word ? tagLabel(word.emoji, word.label) : escapeHtml(value);
}

function todoListItems(list) {
  const column = todoColumn(list.kind, list.columnKey);
  if (!column) return [];
  return todoResourceItems(list.kind).filter((item) =>
    list.filterValues.includes(String(column.sortValue(item))),
  );
}
