function pickFreeTodoStatus(id, status) {
  openInlineMenu = null;
  setFreeTodoStatus(id, status);
}

function freeTodoStatusTag(todo) {
  const current = freeTodoStatus(todo.status);
  return inlineDropdown(
    `free-todo-status:${todo.id}`,
    'status-dropdown',
    /* HTML */ `<summary class="inline-tag">${tagLabel(current.emoji, current.label)}</summary>
      <div class="inline-menu">
        ${Object.entries(FREE_TODO_STATUSES)
          .map(
            ([key, s]) => `<button
            class="inline-menu-item ${s === current ? 'selected' : ''}"
            onclick="pickFreeTodoStatus('${todo.id}', '${key}')"
          >
            ${tagLabel(s.emoji, s.label)}
          </button>`,
          )
          .join('')}
        <button class="inline-menu-item" onclick="pickFreeTodoStatus('${todo.id}', '')">
          ${tagLabel(UNSET_FREE_TODO_STATUS.emoji, 'Aucun statut')}
        </button>
      </div>`,
  );
}
