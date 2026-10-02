function expenseBudgetScenario() {
  return ofCurrentTravel(state.scenarios).find((scenario) => scenario.isChosen) || null;
}

function actualExpenses() {
  return ofCurrentTravel(state.actualExpenses).sort(
    (expenseA, expenseB) =>
      (expenseA.date || '').localeCompare(expenseB.date || '') ||
      (expenseA.label || '').localeCompare(expenseB.label || ''),
  );
}

function getActualExpense(id) {
  return state.actualExpenses.find((expense) => expense.id === id);
}

function emptyActualExpense() {
  return {
    id: null,
    date: dateToIso(new Date()),
    label: '',
    amount: '',
    fixedCostId: '',
    notes: '',
  };
}

function actualExpensesTotal() {
  return actualExpenses().reduce((sum, expense) => sum + priceNumber(expense.amount), 0);
}

function scenarioBudgetTotal(scenario) {
  if (!scenario) return 0;
  const span = scenarioSpan(scenario);
  return getScenarioExpenses(scenario).reduce((sum, cost) => sum + expenseAmount(cost, span), 0);
}

function actualExpenseCostTotal(costId) {
  return actualExpenses()
    .filter((expense) => expense.fixedCostId === costId)
    .reduce((sum, expense) => sum + priceNumber(expense.amount), 0);
}

function actualExpensesWithoutBudget() {
  const costIds = new Set(manualExpenses().map((cost) => cost.id));
  return actualExpenses().filter((expense) => !costIds.has(expense.fixedCostId));
}

function expensesBudgetList(scenario) {
  const costs = manualExpenses();
  const scenarioCostIds = new Set((scenario && scenario.costIds) || []);
  const unbudgeted = actualExpensesWithoutBudget();
  if (!costs.length && !unbudgeted.length) {
    return emptyState(
      'Aucun budget ni dépense réelle',
      'Ajoute une charge au scénario ou une dépense datée.',
    );
  }

  const span = scenario ? scenarioSpan(scenario) : null;
  const budgetTotal = scenarioBudgetTotal(scenario);
  const actualTotal = actualExpensesTotal();
  const remaining = budgetTotal - actualTotal;
  return /* HTML */ `<div class="expenses-table-scroll">
    <table class="expenses-table expenses-budget-table">
      <thead>
        <tr>
          <th>Poste</th>
          <th>Catégories</th>
          <th>Dans le scénario</th>
          <th class="expenses-number">Réel</th>
          <th class="expenses-number">Restant</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        ${costs
          .map((cost) => {
            const inScenario = scenarioCostIds.has(cost.id);
            const budget = inScenario ? expenseAmount(cost, span) : null;
            const actual = actualExpenseCostTotal(cost.id);
            const costRemaining = budget === null ? null : budget - actual;
            return /* HTML */ `<tr>
              <td>
                ${fixedCostLabelCell(cost)}${expenseRecurrence(cost.recurrence).unit ? `<span class="expenses-detail">${escapeHtml(expenseAmountLabel(cost))}</span>` : ''}
              </td>
              <td>${fixedCostCategoriesCell(cost)}</td>
              <td>
                ${budget === null ? '<span class="expenses-muted">Hors scénario retenu</span>' : formatEuros(budget)}
              </td>
              <td class="expenses-number">${formatEuros(actual)}</td>
              <td
                class="expenses-number ${costRemaining !== null && costRemaining < 0 ? 'expenses-over' : 'expenses-under'}"
              >
                ${costRemaining === null ? '—' : formatEuros(costRemaining)}
              </td>
              <td class="expenses-actions">${editButton('charge', cost.id)}</td>
            </tr>`;
          })
          .join('')}
        ${
          unbudgeted.length
            ? /* HTML */ `<tr class="expenses-unbudgeted-row">
                <td>
                  <strong>Non budgétisé</strong
                  ><span class="expenses-detail"
                    >${unbudgeted.length} dépense${unbudgeted.length === 1 ? '' : 's'} sans poste
                    associé</span
                  >
                </td>
                <td>—</td>
                <td>—</td>
                <td>—</td>
                <td class="expenses-number">
                  ${formatEuros(unbudgeted.reduce((sum, expense) => sum + priceNumber(expense.amount), 0))}
                </td>
                <td class="expenses-number">—</td>
                <td></td>
              </tr>`
            : ''
        }
        <tr class="expenses-total-row">
          <td>Total</td>
          <td></td>
          <td>${scenario ? formatEuros(budgetTotal) : '—'}</td>
          <td class="expenses-number">${formatEuros(actualTotal)}</td>
          <td class="expenses-number ${remaining < 0 ? 'expenses-over' : 'expenses-under'}">
            ${scenario ? formatEuros(remaining) : '—'}
          </td>
          <td></td>
        </tr>
      </tbody>
    </table>
  </div>`;
}

function actualExpensesList() {
  const expenses = actualExpenses();
  if (!expenses.length) {
    return emptyState('Aucune dépense réelle', 'Ajoute un restaurant, de l’essence, un parking.');
  }
  const scenario = expenseBudgetScenario();
  const costs = new Map(manualExpenses().map((cost) => [cost.id, cost]));
  const scenarioCostIds = new Set((scenario && scenario.costIds) || []);
  return /* HTML */ `<div class="expenses-table-scroll">
    <table class="expenses-table expenses-actual-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Dépense</th>
          <th>Poste budgétaire</th>
          <th class="expenses-number">Montant</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        ${expenses
          .map((expense) => {
            const cost = costs.get(expense.fixedCostId);
            const budgetLabel = cost
              ? `${escapeHtml(cost.label || 'Sans libellé')}${scenarioCostIds.has(cost.id) ? '' : ' · hors scénario'}`
              : 'Non budgétisé';
            return /* HTML */ `<tr>
              <td class="expenses-date">${escapeHtml(actualExpenseDate(expense.date))}</td>
              <td>
                <strong>${escapeHtml(expense.label || 'Sans libellé')}</strong
                >${expense.notes ? `<span class="expenses-detail">${escapeHtml(expense.notes)}</span>` : ''}
              </td>
              <td>
                <span
                  class="expenses-budget-link ${cost && scenarioCostIds.has(cost.id) ? '' : 'expenses-muted'}"
                  >${budgetLabel}</span
                >
              </td>
              <td class="expenses-number">${formatEuros(priceNumber(expense.amount))}</td>
              <td class="expenses-actions">
                ${editButton('actual-expense', expense.id)}${deleteButton('actualExpenses', expense.id)}
              </td>
            </tr>`;
          })
          .join('')}
      </tbody>
    </table>
  </div>`;
}

function actualExpenseDate(date) {
  const parsed = isoToDate(date);
  return parsed ? parsed.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : '—';
}

function actualExpenseForm(expense) {
  const scenario = expenseBudgetScenario();
  const scenarioCostIds = new Set((scenario && scenario.costIds) || []);
  const budgetCosts = manualExpenses().filter((cost) => scenarioCostIds.has(cost.id));
  const linkedCost = manualExpenses().find((cost) => cost.id === expense.fixedCostId);
  if (linkedCost && !budgetCosts.some((cost) => cost.id === linkedCost.id)) {
    budgetCosts.push(linkedCost);
  }

  return /* HTML */ `
    <h3>${expense.id ? 'Modifier' : 'Ajouter'} une dépense réelle</h3>
    <div class="field">
      <label for="actual-expense-date">Date</label>
      <input id="actual-expense-date" type="date" value="${escapeHtml(expense.date)}" required />
    </div>
    <div class="field">
      <label for="actual-expense-label">Dépense</label>
      <input id="actual-expense-label" type="text" value="${escapeHtml(expense.label)}" required />
    </div>
    <div class="field">
      <label for="actual-expense-amount">Montant</label>
      <input
        id="actual-expense-amount"
        type="text"
        value="${escapeHtml(expense.amount)}"
        required
      />
    </div>
    <div class="field">
      <label for="actual-expense-budget">Poste budgétaire</label>
      <select id="actual-expense-budget">
        <option value="">Non budgétisé</option>
        ${budgetCosts
          .map(
            (cost) =>
              `<option value="${escapeHtml(cost.id)}" ${expense.fixedCostId === cost.id ? 'selected' : ''}>${escapeHtml(cost.label || 'Sans libellé')}</option>`,
          )
          .join('')}
      </select>
    </div>
    <div class="field">
      <label for="actual-expense-notes">Notes</label>
      <textarea id="actual-expense-notes" rows="2">${escapeHtml(expense.notes)}</textarea>
    </div>
    <div class="modal-actions">
      <button class="btn btn-ghost" onclick="dismissModal()">Annuler</button>
      <button class="btn" id="f-save" onclick="saveActualExpense('${expense.id || ''}')">
        Enregistrer
      </button>
    </div>
  `;
}

function saveActualExpense(id) {
  const dateField = document.getElementById('actual-expense-date');
  const labelField = document.getElementById('actual-expense-label');
  const amountField = document.getElementById('actual-expense-amount');
  if (
    !dateField.reportValidity() ||
    !labelField.reportValidity() ||
    !amountField.reportValidity()
  ) {
    return;
  }

  const expense = {
    id: id || uid(),
    travelId: currentTravelId(),
    date: dateField.value,
    label: labelField.value.trim(),
    amount: amountField.value.trim(),
    fixedCostId: document.getElementById('actual-expense-budget').value,
    notes: document.getElementById('actual-expense-notes').value.trim(),
  };
  const index = state.actualExpenses.findIndex((item) => item.id === id);
  if (id) state.actualExpenses[index] = expense;
  else state.actualExpenses.push(expense);
  saveNow();
  closeModal();
}
