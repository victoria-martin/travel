function homeTodoCard() {
  const dynamicCount = todoListsOfTravel().reduce((sum, l) => sum + todoListItems(l).length, 0);
  const freeCount = freeTodosOfTravel().filter((t) => !t.done).length;
  const total = dynamicCount + freeCount;
  return homeCard({
    icon: svgIcon('list-checks'),
    title: 'À faire',
    body: total
      ? `<p class="home-card-meta">${total} tâche${total > 1 ? 's' : ''} à traiter</p>`
      : `<p class="home-card-empty">Rien à faire pour l'instant.</p>`,
    cta: 'Ouvrir la todo',
    onclick: `goTo('a-faire')`,
  });
}
