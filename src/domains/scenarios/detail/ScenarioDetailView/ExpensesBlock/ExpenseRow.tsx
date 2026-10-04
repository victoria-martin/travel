import { Icon } from '@/shared/Icon';
import type { FixedCost, Scenario } from '@/store/types';

// The row carries the expense total for this scenario; its unit says where the count comes from.
export function ExpenseRow({
  scenario,
  cost,
  span,
}: {
  scenario: Scenario;
  cost: FixedCost;
  span: { nights: number; days: number; travelers: number };
}) {
  const unit = window.expenseRecurrence(cost.recurrence).unit;
  return (
    <div className="expense-line">
      <span className="expense-label">
        {cost.label || 'Sans libellé'}
        {unit && <span className="expense-unit">{window.expenseAmountLabel(cost)}</span>}
      </span>
      <strong className="expense-amount">
        {window.formatEuros(window.expenseAmount(cost, span))}
      </strong>
      <button
        type="button"
        className="icon-btn"
        title="Retirer du scénario"
        onClick={() => window.detachScenarioExpense(scenario.id, cost.id)}
      >
        <Icon name="x" />
      </button>
    </div>
  );
}
