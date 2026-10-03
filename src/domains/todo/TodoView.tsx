import { LegacyMarkup } from '@/shared/LegacyMarkup';
import { useTravelStore } from '@/store/useTravelStore';
import { useState } from 'react';
import { FreeTodoCard } from './TodoView/FreeTodoCard';

/*
  Porte js/views/todo/{todo,header,free/card}.js. Le builder (ressource/colonne/valeurs à choisir)
  et chaque liste dynamique restent délégués via LegacyMarkup : ils s'appuient sur listTable, qui
  sait rendre la table de N'IMPORTE quel `kind` (hébergements, attractions, transports…) avec les
  colonnes que CHAQUE écran déclare — refaire ça en React demanderait un registre colonnes-par-kind
  qui n'existe pas encore, un chantier à part. Seule la carte "Tâches libres" (texte libre, pas de
  ressource à filtrer) est un vrai composant React.
*/
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
          <p className="view-sub">
            {lists.length} liste{lists.length > 1 ? 's' : ''} — {itemCount} ligne
            {itemCount > 1 ? 's' : ''} à traiter
          </p>
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
      <LegacyMarkup html={window.todoBuilder()} />
      {lists.length === 0 ? (
        <div className="empty-state">
          <strong>Aucune liste</strong>
          Choisis une ressource et une colonne, puis coche les valeurs à suivre.
        </div>
      ) : (
        lists.map((list) => <LegacyMarkup key={list.id} html={window.todoListCard(list)} />)
      )}
    </>
  );
}
