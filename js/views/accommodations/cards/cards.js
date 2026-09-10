function accommodationCards(items) {
  return /* HTML */ `<div class="card-grid">
    ${items.map((a) => accommodationCard(a)).join('')}
  </div>`;
}
