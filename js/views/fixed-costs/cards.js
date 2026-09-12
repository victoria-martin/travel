function fixedCostCards(items) {
  return /* HTML */ `<div class="card-grid">${items.map((c) => fixedCostCard(c)).join('')}</div>`;
}

function fixedCostCard(cost) {
  return /* HTML */ `<div class="card">
    <div class="card-top">
      <p class="card-name">${escapeHtml(cost.label) || 'Sans nom'}</p>
    </div>
    <div class="card-meta">
      ${cost.amount ? `<span>Montant : ${escapeHtml(cost.amount)}</span>` : ''}
      ${cost.category ? `<span>Catégorie : ${escapeHtml(cost.category)}</span>` : ''}
      ${cost.recurrence ? `<span>Récurrence : ${escapeHtml(cost.recurrence)}</span>` : ''}
      <span>📝 ${fixedCostNotesEditable(cost)}</span>
    </div>
    <div class="card-actions">
      ${cardEditButton('charge', cost.id)} ${cardDeleteButton('fixedCosts', cost.id)}
    </div>
  </div>`;
}
