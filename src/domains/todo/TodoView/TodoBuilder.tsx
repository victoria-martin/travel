import { Icon } from '@/shared/Icon';
import { useState } from 'react';
import { TodoValuePills } from './TodoValuePills';

type Draft = { kind: string; columnKey: string; values: string[] };

// Three answers make a list: the resource, the column, and the words kept on it.
export function TodoBuilder() {
  const [draft, setDraft] = useState<Draft>({
    kind: window.LIST_RESOURCES[0].kind,
    columnKey: '',
    values: [],
  });
  const columns = window.filterableColumns(draft.kind);
  const column = columns.find((candidate) => candidate.key === draft.columnKey) || columns[0];

  const toggleValue = (value: string) =>
    setDraft({
      ...draft,
      values: draft.values.includes(value)
        ? draft.values.filter((kept) => kept !== value)
        : [...draft.values, value],
    });

  return (
    <section className="todo-builder">
      <div className="todo-builder-row">
        <select
          className="inline-select"
          value={draft.kind}
          onChange={(event) => setDraft({ kind: event.target.value, columnKey: '', values: [] })}
        >
          {window.LIST_RESOURCES.map((resource) => (
            <option key={resource.kind} value={resource.kind}>
              {resource.label}
            </option>
          ))}
        </select>
        {column && (
          <select
            className="inline-select"
            value={column.key}
            onChange={(event) => setDraft({ ...draft, columnKey: event.target.value, values: [] })}
          >
            {columns.map((option) => (
              <option key={option.key} value={option.key}>
                {window.columnLabel(option)}
              </option>
            ))}
          </select>
        )}
        <button
          type="button"
          className="btn"
          disabled={!column || !draft.values.length}
          onClick={() => {
            if (!column) return;
            window.addTodoList(draft.kind, column.key, draft.values);
            setDraft({ ...draft, columnKey: column.key, values: [] });
          }}
        >
          <Icon name="plus" /> Ajouter la liste
        </button>
      </div>
      {column ? (
        <TodoValuePills
          kind={draft.kind}
          column={column}
          selected={draft.values}
          onToggle={toggleValue}
        />
      ) : (
        <p className="todo-hint">Rien à filtrer sur cette ressource pour l’instant.</p>
      )}
    </section>
  );
}
