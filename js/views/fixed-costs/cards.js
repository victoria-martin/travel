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
      <button class="btn-ghost btn btn-small" onclick="openModal('charge','${cost.id}')">
        Modifier
      </button>
      <button class="btn-danger btn btn-small" onclick="deleteItem('fixedCosts','${cost.id}')">
        Suppr.
      </button>
    </div>
  </div>`;
}
