function carCards(items) {
  return /* HTML */ `<div class="card-grid">${items.map((c) => carCard(c)).join('')}</div>`;
}

function carCard(car) {
  return /* HTML */ `<div class="card">
    <div class="card-top">
      <p class="card-name">${escapeHtml(car.name) || 'Sans nom'}</p>
      ${defaultCarCell(car)}
    </div>
    <div class="card-meta">
      ${car.model ? `<span>Modèle : ${escapeHtml(car.model)}</span>` : ''}
      ${car.price ? `<span>Prix : ${escapeHtml(car.price)}</span>` : ''}
      ${car.dates ? `<span>Dates : ${escapeHtml(car.dates)}</span>` : ''}
      ${car.location ? `<span>Lieu de prise en charge : ${escapeHtml(car.location)}</span>` : ''}
      <span>📝 ${carNotesEditable(car)}</span>
    </div>
    <div class="card-actions">
      <button class="btn-ghost btn btn-small" onclick="openModal('voiture','${car.id}')">
        Modifier
      </button>
      <button class="btn-danger btn btn-small" onclick="deleteItem('cars','${car.id}')">
        Suppr.
      </button>
      ${car.link ? linkButton(car.link, 'Lien') : ''}
    </div>
  </div>`;
}
