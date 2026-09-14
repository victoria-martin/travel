function scenarioExpensesBlock(scenario) {
  const expenses = getScenarioExpenses(scenario);
  return /* HTML */ `<div class="scenario-extra scenario-extra-expenses">
    <div class="scenario-extra-head">
      <div class="acc-recap-title">Dépenses</div>
      ${expenses.length ? `<strong>${formatEuros(fixedCostsTotal(scenario))}</strong>` : ''}
    </div>
    ${
      expenses.length === 0
        ? /* HTML */ `<div class="scenario-extra-empty">
            Aucune dépense rattachée — celles du voyage restent sur la page Dépenses.
          </div>`
        : expenses.map((cost) => scenarioExpenseRow(scenario, cost)).join('')
    }
    <div class="scenario-extra-actions">
      ${scenarioExpenseDropdown(scenario)}
      ${toolbarButton({
        icon: '+',
        label: 'Ajouter une dépense',
        onclick: `openModal('charge', '', '${scenario.id}')`,
      })}
    </div>
  </div>`;
}

function scenarioExpenseRow(scenario, cost) {
  return /* HTML */ `<div class="expense-line">
    <span class="expense-label">${escapeHtml(cost.label || 'Sans libellé')}</span>
    <strong class="expense-amount">${formatEuros(priceNumber(cost.amount))}</strong>
    <button
      class="icon-btn"
      onclick="detachScenarioExpense('${scenario.id}','${cost.id}')"
      title="Retirer du scénario"
    >
      ✕
    </button>
  </div>`;
}

function attachScenarioExpense(scenarioId, costId) {
  getScenario(scenarioId).costIds.push(costId);
  saveNow();
  render();
}

// Retirer une dépense du scénario ne la supprime pas : elle reste sur la page Dépenses.
function detachScenarioExpense(scenarioId, costId) {
  const scenario = getScenario(scenarioId);
  scenario.costIds = scenario.costIds.filter((id) => id !== costId);
  saveNow();
  render();
}
