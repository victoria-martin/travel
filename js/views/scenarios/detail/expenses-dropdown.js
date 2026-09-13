function pickScenarioExpense(scenarioId, costId) {
  openInlineMenu = null;
  attachScenarioExpense(scenarioId, costId);
}

function attachableExpenses(scenario) {
  return ofCurrentTravel(state.fixedCosts).filter((cost) => !scenario.costIds.includes(cost.id));
}

function scenarioExpenseDropdown(scenario) {
  const attachable = attachableExpenses(scenario);
  return inlineDropdown(
    `expense:${scenario.id}`,
    'expense-dropdown',
    /* HTML */ `<summary class="inline-tag">${tagLabel('', 'Rattacher une dépense')}</summary>
      <div class="inline-menu">
        ${attachable.length === 0
          ? '<div class="inline-menu-group">Aucune dépense à rattacher</div>'
          : attachable
              .map(
                (cost) => `<button
                  class="inline-menu-item"
                  onclick="pickScenarioExpense('${scenario.id}','${cost.id}')"
                >
                  <span class="inline-label">${escapeHtml(cost.label || 'Sans libellé')}</span>
                  ${cost.amount ? `<span class="inline-menu-aside">${escapeHtml(formatEuros(priceNumber(cost.amount)))}</span>` : ''}
                </button>`,
              )
              .join('')}
      </div>`,
  );
}
