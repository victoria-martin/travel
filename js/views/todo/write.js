function addTodoList(kind, columnKey, filterValues) {
  state.todoLists.push({
    id: uid(),
    travelId: currentTravelId(),
    kind,
    columnKey,
    filterValues,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  saveNow();
  showToast('Liste créée');
}

// A list is edited where it is read: clicking one of its pills adds or drops that word.
function toggleTodoListValue(id, value) {
  const list = getTodoList(id);
  list.filterValues = list.filterValues.includes(value)
    ? list.filterValues.filter((v) => v !== value)
    : [...list.filterValues, value];
  list.updatedAt = new Date().toISOString();
  saveNow();
  showToast('Liste modifiée');
}
