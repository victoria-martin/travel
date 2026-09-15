function renderTodoView() {
  const lists = todoListsOfTravel();
  return /* HTML */ `
    ${todoHeader(lists)} ${todoBuilder()}
    ${
      lists.length === 0
        ? emptyState(
            'Aucune liste',
            'Choisis une ressource et une colonne, puis coche les valeurs à suivre.',
          )
        : lists.map(todoListCard).join('')
    }
  `;
}
