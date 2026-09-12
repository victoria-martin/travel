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
      ${car.pricePerDay ? `<span>${escapeHtml(carPriceLabel(car.pricePerDay, '/ jour'))}</span>` : ''}
      ${car.priceTotal ? `<span>Total : ${escapeHtml(carPriceLabel(car.priceTotal))}</span>` : ''}
      ${car.dates ? `<span>Dates : ${escapeHtml(car.dates)}</span>` : ''}
      ${car.location ? `<span>Lieu de prise en charge : ${escapeHtml(car.location)}</span>` : ''}
      <span>📝 ${carNotesEditable(car)}</span>
    </div>
    <div class="card-actions">
      ${cardEditButton('voiture', car.id)} ${cardDeleteButton('cars', car.id)}
      ${car.link ? linkButton(car.link, 'Lien') : ''}
    </div>
  </div>`;
}
