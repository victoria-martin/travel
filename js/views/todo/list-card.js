/*
  A list shows the table of the page it draws from — same cells, same edits in place. Its pills are
  the ones the builder offered, so the words kept are changed where they are read.
*/
function todoListCard(list) {
  const resource = todoResource(list.kind);
  const column = todoColumn(list.kind, list.columnKey);
  const items = todoListItems(list);
  return /* HTML */ `<section class="todo-list">
    <div class="todo-list-head">
      <h3 class="todo-list-title">
        ${resource.icon} ${resource.label}
        ${column ? `<span class="todo-list-on">${escapeHtml(columnLabel(column))}</span>` : ''}
        <span class="todo-list-count">${items.length}</span>
      </h3>
      <button class="icon-btn" onclick="deleteTodoList('${list.id}')" title="Retirer cette liste">
        ${svgIcon('x')}
      </button>
    </div>
    ${
      column
        ? todoValuePills(
            list.kind,
            column,
            list.filterValues,
            (i) => `toggleTodoListValue('${list.id}',${i})`,
          )
        : `<p class="todo-hint">La colonne « ${escapeHtml(list.columnKey)} » n'existe plus.</p>`
    }
    ${items.length ? listTable(list.kind, items) : emptyState('Rien à traiter', 'Aucune ligne ne porte ces valeurs.')}
  </section>`;
}
