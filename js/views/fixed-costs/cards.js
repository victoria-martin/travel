function fixedCostCards(items) {
  return /* HTML */ `<div class="card-grid">${items.map((c) => fixedCostCard(c)).join('')}</div>`;
}

function fixedCostCard(cost) {
  return /* HTML */ `<div class="card">
    <div class="card-top">
      <p class="card-name">${escapeHtml(cost.label) || 'Sans nom'}</p>
    </div>
    <div class="card-meta">
      ${cost.amount ? `<span>Montant : ${escapeHtml(expenseAmountLabel(cost))}</span>` : ''}
      ${
        cost.categories && cost.categories.length ? `<span>${tagChips(cost.categories)}</span>` : ''
      }
      ${
        expenseRecurrence(cost.recurrence).unit
          ? `<span>Récurrence : ${expenseRecurrence(cost.recurrence).label}</span>`
          : ''
      }
      <span>${svgIcon('file-text')} ${fixedCostNotesEditable(cost)}</span>
    </div>
    <div class="card-actions">
      ${cardEditButton('charge', cost.id)} ${cardDeleteButton('fixedCosts', cost.id)}
    </div>
  </div>`;
}
