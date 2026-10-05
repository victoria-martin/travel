import { useTravelStore } from '@/store/useTravelStore';
import { useState } from 'react';
import { FreeTodoCard } from './TodoView/FreeTodoCard';
import { TodoBuilder } from './TodoView/TodoBuilder';
import { TodoListCard } from './TodoView/TodoListCard';

export function TodoView() {
  useTravelStore();
  const [query, setQuery] = useState('');
  const lists = window.todoListsOfTravel();
  const itemCount = lists.reduce((sum, list) => sum + window.todoListItems(list).length, 0);

  function handleSearch(value: string) {
    setQuery(value);
    window.setTodoSearch(value);
  }

  return (
    <>
      <div className="view-header">
        <div>
          <h2 className="view-title">À faire</h2>
          <span className="view-sub">
            {lists.length} liste{lists.length > 1 ? 's' : ''} — {itemCount} ligne
            {itemCount > 1 ? 's' : ''} à traiter
          </span>
        </div>
        <div className="view-header-actions">
          <label className="list-search" title="Rechercher">
            <span className="sr-only">Rechercher</span>
            <input
              type="search"
              placeholder="Rechercher…"
              value={query}
              onChange={(event) => handleSearch(event.target.value)}
            />
          </label>
        </div>
      </div>
      <FreeTodoCard query={query} />
      <TodoBuilder />
      {lists.length === 0 ? (
        <div className="empty-state">
          <strong>Aucune liste</strong>
          Choisis une ressource et une colonne, puis coche les valeurs à suivre.
        </div>
      ) : (
        lists.map((list) => <TodoListCard key={list.id} list={list} />)
      )}
    </>
  );
}
