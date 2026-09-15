/*
  What the builder holds is the gesture in progress and not a preference worth finding again, so it
  lives in a module global. Changing the resource or the column drops the words: they were read on
  the column left behind.
*/
let todoDraft = { kind: LIST_RESOURCES[0].kind, columnKey: '', values: [] };

// The column a draft filters on: the one it names, or the first its resource offers.
function todoDraftColumn() {
  const columns = filterableColumns(todoDraft.kind);
  return columns.find((c) => c.key === todoDraft.columnKey) || columns[0] || null;
}

function setTodoDraftKind(kind) {
  todoDraft = { kind, columnKey: '', values: [] };
  render();
}

function setTodoDraftColumn(key) {
  todoDraft = { ...todoDraft, columnKey: key, values: [] };
  render();
}

function toggleTodoDraftValue(index) {
  const value = filterValues(todoDraft.kind, todoDraftColumn())[index];
  todoDraft.values = todoDraft.values.includes(value)
    ? todoDraft.values.filter((v) => v !== value)
    : [...todoDraft.values, value];
  render();
}
