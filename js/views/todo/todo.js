let todoSearchQuery = '';

function todoSearchField() {
  return `<label class="list-search" data-list-search="todo" title="Rechercher">
    <span class="sr-only">Rechercher</span>
    <input type="search" placeholder="Rechercher…" value="${escapeHtml(todoSearchQuery)}"
      oninput="setTodoSearch(this.value)" />
  </label>`;
}

function setTodoSearch(query) {
  todoSearchQuery = query;
  render();
  const input = document.querySelector('.list-search[data-list-search="todo"] input');
  if (input) {
    input.focus();
    input.setSelectionRange(query.length, query.length);
  }
}

function renderTodoView() {
  const lists = todoListsOfTravel();
  return /* HTML */ `
    ${todoHeader(lists)} ${freeTodoCard()} ${todoBuilder()}
    ${
      lists.length === 0
        ? emptyState(
            'Aucune liste',
            'Choisis une ressource et une colonne, puis coche les valeurs à suivre.',
          )
        : lists.map(todoListCard).join('')
    }
  `;
}
