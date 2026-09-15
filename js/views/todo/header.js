function todoHeader(lists) {
  const items = lists.reduce((total, list) => total + todoListItems(list).length, 0);
  return /* HTML */ `<div class="view-header">
    <div>
      <h2 class="view-title">À faire</h2>
      <p class="view-sub">
        ${lists.length} liste${lists.length > 1 ? 's' : ''} — ${items} ligne${items > 1 ? 's' : ''}
        à traiter
      </p>
    </div>
  </div>`;
}
