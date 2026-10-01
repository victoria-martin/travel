function addFreeTodo(text) {
  const trimmed = text.trim();
  if (!trimmed) return;
  state.freeTodos.push({
    id: uid(),
    travelId: currentTravelId(),
    text: trimmed,
    done: false,
    status: '',
  });
  saveNow();
  showToast('Tâche créée');
  focusFreeTodoInput();
}

function toggleFreeTodo(id) {
  const todo = getFreeTodo(id);
  todo.done = !todo.done;
  saveNow();
  showToast('Tâche modifiée');
}

function setFreeTodoStatus(id, status) {
  const todo = getFreeTodo(id);
  todo.status = status;
  saveNow();
  showToast('Tâche modifiée');
}

function deleteFreeTodo(id) {
  deleteItem('freeTodos', id);
}

function focusFreeTodoInput() {
  const field = document.getElementById('free-todo-input');
  if (field) field.focus();
}
