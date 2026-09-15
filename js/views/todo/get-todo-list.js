function todoListsOfTravel() {
  return ofCurrentTravel(state.todoLists);
}

function getTodoList(id) {
  return state.todoLists.find((l) => l.id === id);
}
