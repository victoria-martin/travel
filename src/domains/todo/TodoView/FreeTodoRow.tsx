import { Icon } from '@/shared/Icon';
import { TagDropdown } from '@/shared/select/TagDropdown';
import type { FreeTodo } from '@/store/types';

// Port de freeTodoRow/freeTodoStatusTag (js/views/todo/free/{card,status-tag}.js).
export function FreeTodoRow({ todo }: { todo: FreeTodo }) {
  return (
    <div className={`free-todo-row ${todo.done ? 'is-done' : ''}`}>
      <input type="checkbox" checked={todo.done} onChange={() => window.toggleFreeTodo(todo.id)} />
      <span className="free-todo-text">{todo.text}</span>
      <TagDropdown
        className="status-dropdown"
        dict={window.FREE_TODO_STATUSES}
        current={window.freeTodoStatus(todo.status)}
        emptyOption={window.UNSET_FREE_TODO_STATUS}
        onPick={(key) => window.setFreeTodoStatus(todo.id, key)}
      />
      <button
        type="button"
        className="icon-btn"
        title="Supprimer"
        onClick={() => window.deleteFreeTodo(todo.id)}
      >
        <Icon name="x" />
      </button>
    </div>
  );
}
