import { HomeCard } from './HomeCard';

export function TodoCard() {
  const dynamicCount = window
    .todoListsOfTravel()
    .reduce((sum, list) => sum + window.todoListItems(list).length, 0);
  const freeCount = window.freeTodosOfTravel().filter((todo) => !todo.done).length;
  const total = dynamicCount + freeCount;

  return (
    <HomeCard
      icon="list-checks"
      title="À faire"
      cta="Ouvrir la todo"
      onClick={() => window.goTo('a-faire')}
    >
      {total ? (
        <p className="home-card-meta">
          {total} tâche{total > 1 ? 's' : ''} à traiter
        </p>
      ) : (
        <p className="home-card-empty">Rien à faire pour l&apos;instant.</p>
      )}
    </HomeCard>
  );
}
