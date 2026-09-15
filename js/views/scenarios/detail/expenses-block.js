function scenarioExpensesBlock(scenario) {
  const expenses = getScenarioExpenses(scenario);
  const span = scenarioSpan(scenario);
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
        : expenses.map((cost) => scenarioExpenseRow(scenario, cost, span)).join('')
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

// La ligne porte le total de la dépense pour ce scénario ; son unité dit d'où vient le compte.
function scenarioExpenseRow(scenario, cost, span) {
  const unit = expenseRecurrence(cost.recurrence).unit;
  return /* HTML */ `<div class="expense-line">
    <span class="expense-label"
      >${escapeHtml(cost.label || 'Sans libellé')}
      ${unit ? `<span class="expense-unit">${escapeHtml(expenseAmountLabel(cost))}</span>` : ''}</span
    >
    <strong class="expense-amount">${formatEuros(expenseAmount(cost, span))}</strong>
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
