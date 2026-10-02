import { FreeTodoRow } from './FreeTodoRow';

// Port de freeTodoCard (js/views/todo/free/card.js). `query` vient du champ de recherche partagé
// de TodoView — une tâche libre n'a que `text` à comparer, contrairement à todoItemMatchesSearch
// (nom/label/description/notes/texte) qui sert les listes dynamiques déléguées au legacy.
export function FreeTodoCard({ query }: { query: string }) {
  const wanted = query.trim().toLowerCase();
  const todos = window
    .freeTodosOfTravel()
    .filter((todo) => !wanted || todo.text.toLowerCase().includes(wanted));
  const done = todos.filter((todo) => todo.done).length;

  return (
    <section className="todo-list">
      <div className="todo-list-head">
        <h3 className="todo-list-title">
          Tâches libres <span className="todo-list-count">{done}/{todos.length}</span>
        </h3>
      </div>
      {todos.length > 0 && (
        <div className="free-todo-rows">
          {todos.map((todo) => (
            <FreeTodoRow key={todo.id} todo={todo} />
          ))}
        </div>
      )}
      <input
        className="free-todo-input"
        type="text"
        placeholder="Ajouter une tâche…"
        onKeyDown={(event) => {
          if (event.key !== 'Enter') return;
          event.preventDefault();
          window.addFreeTodo(event.currentTarget.value);
          event.currentTarget.value = '';
        }}
      />
    </section>
  );
}
