function todoListsOfTravel() {
  return ofCurrentTravel(state.todoLists);
}

function getTodoList(id) {
  return state.todoLists.find((l) => l.id === id);
}

// Les lignes d'une liste : celles qui portent l'un des mots gardés sur sa colonne.
function todoListItems(list) {
  const column = filterColumn(list.kind, list.columnKey);
  if (!column) return [];
  return resourceItems(list.kind)
    .filter((item) =>
      itemFilterValues(item, column).some((value) => list.filterValues.includes(value)),
    )
    .filter(todoItemMatchesSearch);
}

function todoItemMatchesSearch(item) {
  const wanted = normalizeListSearch(todoSearchQuery);
  if (!wanted) return true;
  return normalizeListSearch(
    [item.name, item.label, item.description, item.notes, item.text].filter(Boolean).join(' '),
  ).includes(wanted);
}
