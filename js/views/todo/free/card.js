/*
  Une tâche libre est un texte tapé à la main : elle ne filtre aucune ressource, contrairement aux
  listes dynamiques du builder. Entrée l'ajoute et rouvre le champ vide.
*/
function freeTodoCard() {
  const todos = freeTodosOfTravel().filter(todoItemMatchesSearch);
  const done = todos.filter((t) => t.done).length;
  return /* HTML */ `<section class="todo-list">
    <div class="todo-list-head">
      <h3 class="todo-list-title">
        Tâches libres
        <span class="todo-list-count">${done}/${todos.length}</span>
      </h3>
    </div>
    ${todos.length ? `<div class="free-todo-rows">${todos.map(freeTodoRow).join('')}</div>` : ''}
    <input
      id="free-todo-input"
      class="free-todo-input"
      type="text"
      placeholder="Ajouter une tâche…"
      onkeydown="freeTodoInputKeydown(event)"
    />
  </section>`;
}

function freeTodoRow(todo) {
  return /* HTML */ `<div class="free-todo-row ${todo.done ? 'is-done' : ''}">
    <input type="checkbox" ${todo.done ? 'checked' : ''} onchange="toggleFreeTodo('${todo.id}')" />
    <span class="free-todo-text">${escapeHtml(todo.text)}</span>
    <button class="icon-btn" onclick="deleteFreeTodo('${todo.id}')" title="Supprimer">
      ${svgIcon('x')}
    </button>
  </div>`;
}

function freeTodoInputKeydown(event) {
  if (event.key !== 'Enter') return;
  event.preventDefault();
  addFreeTodo(event.target.value);
  event.target.value = '';
}
