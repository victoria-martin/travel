function pickScenarioExpense(scenarioId, costId) {
  openInlineMenu = null;
  attachScenarioExpense(scenarioId, costId);
}

function scenarioExpenseDropdown(scenario) {
  const attachable = costMatches('', scenario.costIds);
  return inlineDropdown(
    `expense:${scenario.id}`,
    'expense-dropdown',
    /* HTML */ `<summary class="inline-tag">${tagLabel('', 'Rattacher une dépense')}</summary>
      <div class="inline-menu">
        ${
          attachable.length === 0
            ? '<div class="inline-menu-group">Aucune dépense à rattacher</div>'
            : attachable
                .map(
                  (cost) => `<button
                  class="inline-menu-item"
                  onclick="pickScenarioExpense('${scenario.id}','${cost.id}')"
                >
                  <span class="inline-label">${escapeHtml(costLabel(cost))}</span>
                  ${cost.amount ? `<span class="inline-menu-aside">${escapeHtml(expenseAmountLabel(cost))}</span>` : ''}
                </button>`,
                )
                .join('')
        }
      </div>`,
  );
}
