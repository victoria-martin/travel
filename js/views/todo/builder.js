/*
  Three answers make a list: the resource, the column, and the words kept on it. The builder stays
  at the top of the page — composing is what the page is for.
*/
function todoBuilder() {
  const column = todoDraftColumn();
  return /* HTML */ `<section class="todo-builder">
    <div class="todo-builder-row">
      <select class="inline-select" onchange="setTodoDraftKind(this.value)">
        ${LIST_RESOURCES.map((r) => todoOption(r.kind, r.label, r.kind === todoDraft.kind)).join(
          '',
        )}
      </select>
      ${column ? todoColumnSelect(column) : ''}
      <button class="btn" onclick="addTodoList()" ${todoDraft.values.length ? '' : 'disabled'}>
        ${svgIcon('plus')} Ajouter la liste
      </button>
    </div>
    ${
      column
        ? todoValuePills(
            todoDraft.kind,
            column,
            todoDraft.values,
            (i) => `toggleTodoDraftValue(${i})`,
          )
        : `<p class="todo-hint">Rien à filtrer sur cette ressource pour l'instant.</p>`
    }
  </section>`;
}

function todoColumnSelect(column) {
  return /* HTML */ `<select class="inline-select" onchange="setTodoDraftColumn(this.value)">
    ${filterableColumns(todoDraft.kind)
      .map((c) => todoOption(c.key, columnLabel(c), c.key === column.key))
      .join('')}
  </select>`;
}

function todoOption(value, label, selected) {
  return `<option value="${value}" ${selected ? 'selected' : ''}>${escapeHtml(label)}</option>`;
}
