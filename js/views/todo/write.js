function addTodoList() {
  const column = todoDraftColumn();
  if (!column || !todoDraft.values.length) return;
  state.todoLists.push({
    id: uid(),
    travelId: currentTravelId(),
    kind: todoDraft.kind,
    columnKey: column.key,
    filterValues: todoDraft.values,
  });
  todoDraft = { kind: todoDraft.kind, columnKey: column.key, values: [] };
  saveNow();
  showToast('Liste créée');
}

// A list is edited where it is read: clicking one of its pills adds or drops that word.
function toggleTodoListValue(id, index) {
  const list = getTodoList(id);
  const value = filterValues(list.kind, filterColumn(list.kind, list.columnKey))[index];
  list.filterValues = list.filterValues.includes(value)
    ? list.filterValues.filter((v) => v !== value)
    : [...list.filterValues, value];
  saveNow();
  showToast('Liste modifiée');
}

function deleteTodoList(id) {
  deleteItem('todoLists', id);
}
