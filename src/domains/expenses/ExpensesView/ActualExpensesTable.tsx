import { Icon } from '../../../shared/Icon';

// Port de actualExpensesList/actualExpenseDate (js/views/expenses/actual.js).
export function ActualExpensesTable() {
  const expenses = window.actualExpenses();
  if (!expenses.length) {
    return (
      <div className="empty-state">
        <strong>Aucune dépense réelle</strong>
        Ajoute un restaurant, de l&apos;essence, un parking.
      </div>
    );
  }

  const scenario = window.expenseBudgetScenario();
  const costs = new Map(window.manualExpenses().map((cost) => [cost.id, cost]));
  const scenarioCostIds = new Set(scenario?.costIds || []);

  return (
    <div className="expenses-table-scroll">
      <table className="expenses-table expenses-actual-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Dépense</th>
            <th>Poste budgétaire</th>
            <th className="expenses-number">Montant</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => {
            const cost = costs.get(expense.fixedCostId);
            const parsed = window.isoToDate(expense.date);
            const dateLabel = parsed
              ? parsed.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
              : '—';
            return (
              <tr key={expense.id}>
                <td className="expenses-date">{dateLabel}</td>
                <td>
                  <strong>{expense.label || 'Sans libellé'}</strong>
                  {(expense.category || expense.subCategory) && (
                    <span className="expenses-detail">
                      {[expense.category, expense.subCategory].filter(Boolean).join(' · ')}
                    </span>
                  )}
                  {expense.notes && <span className="expenses-detail">{expense.notes}</span>}
                </td>
                <td>
                  <span
                    className={`expenses-budget-link ${cost && scenarioCostIds.has(cost.id) ? '' : 'expenses-muted'}`}
                  >
                    {cost
                      ? `${cost.label || 'Sans libellé'}${scenarioCostIds.has(cost.id) ? '' : ' · hors scénario'}`
                      : 'Non budgétisé'}
                  </span>
                </td>
                <td className="expenses-number">{window.formatEuros(window.priceNumber(expense.amount))}</td>
                <td className="expenses-actions">
                  <button
                    type="button"
                    className="icon-btn"
                    title="Modifier"
                    aria-label={`Modifier ${expense.label}`}
                    onClick={() => window.openModal('actual-expense', expense.id)}
                  >
                    <Icon name="pencil" />
                  </button>
                  <button
                    type="button"
                    className="icon-btn"
                    title="Supprimer"
                    aria-label={`Supprimer ${expense.label}`}
                    onClick={() => window.deleteItem('actualExpenses', expense.id)}
                  >
                    <Icon name="trash-2" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
