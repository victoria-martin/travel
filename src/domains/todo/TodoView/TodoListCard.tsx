import { Icon } from '@/shared/Icon';
import type { TodoList } from '@/store/types';
import { TodoListTable } from './TodoListCard/TodoListTable';
import { TodoValuePills } from './TodoValuePills';

// A list's pills are the ones the builder offered: the words kept are changed where they are read.
export function TodoListCard({ list }: { list: TodoList }) {
  const resource = window.listResource(list.kind);
  const column = window.filterColumn(list.kind, list.columnKey);
  const items = window.todoListItems(list);
  return (
    <section className="todo-list">
      <div className="todo-list-head">
        <h3 className="todo-list-title">
          <span dangerouslySetInnerHTML={{ __html: resource.icon }} /> {resource.label}
          {column && <span className="todo-list-on">{window.columnLabel(column)}</span>}
          <span className="todo-list-count">{items.length}</span>
        </h3>
        <button
          type="button"
          className="icon-btn"
          title="Retirer cette liste"
          onClick={() => window.deleteItem('todoLists', list.id)}
        >
          <Icon name="x" />
        </button>
      </div>
      {column ? (
        <TodoValuePills
          kind={list.kind}
          column={column}
          selected={list.filterValues}
          onToggle={(value) => window.toggleTodoListValue(list.id, value)}
        />
      ) : (
        <p className="todo-hint">La colonne « {list.columnKey} » n’existe plus.</p>
      )}
      {items.length ? (
        <TodoListTable kind={list.kind} items={items} />
      ) : (
        <div className="empty-state">
          <strong>Rien à traiter</strong>
          Aucune ligne ne porte ces valeurs.
        </div>
      )}
    </section>
  );
}
