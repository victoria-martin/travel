function freeTodosOfTravel() {
  return ofCurrentTravel(state.freeTodos);
}

function getFreeTodo(id) {
  return state.freeTodos.find((t) => t.id === id);
}
