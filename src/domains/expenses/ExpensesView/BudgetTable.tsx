import { EditableTagsCell } from '../../../shared/cells/EditableTagsCell';
import { LabelCell } from '../../fixed-costs/cells';
import type { FixedCost, Scenario } from '../../../store/types';
import { Icon } from '../../../shared/Icon';

/*
  Port de expensesBudgetList (js/views/expenses/actual.js). `LabelCell` (domaine Charges fixes)
  réutilisé tel quel pour le libellé + notes — même entité, même rendu, pas de raison de dupliquer.
*/
export function BudgetTable({ scenario }: { scenario: Scenario | null }) {
  const costs = window.manualExpenses();
  const scenarioCostIds = new Set(scenario?.costIds || []);
  const unbudgeted = window.actualExpensesWithoutBudget();

  if (!costs.length && !unbudgeted.length) {
    return (
      <div className="empty-state">
        <strong>Aucun budget ni dépense réelle</strong>
        Ajoute une charge au scénario ou une dépense datée.
      </div>
    );
  }

  const span = scenario ? window.scenarioSpan(scenario) : null;
  const budgetTotal = window.scenarioBudgetTotal(scenario);
  const actualTotal = window.actualExpensesTotal();
  const remaining = budgetTotal - actualTotal;

  return (
    <div className="expenses-table-scroll">
      <table className="expenses-table expenses-budget-table">
        <thead>
          <tr>
            <th>Poste</th>
            <th>Catégories</th>
            <th>Dans le scénario</th>
            <th className="expenses-number">Réel</th>
            <th className="expenses-number">Restant</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {costs.map((cost) => (
            <BudgetRow key={cost.id} cost={cost} scenarioCostIds={scenarioCostIds} span={span} />
          ))}
          {unbudgeted.length > 0 && (
            <tr className="expenses-unbudgeted-row">
              <td>
                <strong>Non budgétisé</strong>
                <span className="expenses-detail">
                  {unbudgeted.length} dépense{unbudgeted.length === 1 ? '' : 's'} sans poste associé
                </span>
              </td>
              <td>—</td>
              <td>—</td>
              <td>—</td>
              <td className="expenses-number">
                {window.formatEuros(
                  unbudgeted.reduce((sum, expense) => sum + window.priceNumber(expense.amount), 0),
                )}
              </td>
              <td className="expenses-number">—</td>
              <td></td>
            </tr>
          )}
          <tr className="expenses-total-row">
            <td>Total</td>
            <td></td>
            <td>{scenario ? window.formatEuros(budgetTotal) : '—'}</td>
            <td className="expenses-number">{window.formatEuros(actualTotal)}</td>
            <td className={`expenses-number ${remaining < 0 ? 'expenses-over' : 'expenses-under'}`}>
              {scenario ? window.formatEuros(remaining) : '—'}
            </td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function BudgetRow({
  cost,
  scenarioCostIds,
  span,
}: {
  cost: FixedCost;
  scenarioCostIds: Set<string>;
  span: { nights: number; days: number; travelers: number } | null;
}) {
  const inScenario = scenarioCostIds.has(cost.id);
  const budget = inScenario && span ? window.expenseAmount(cost, span) : null;
  const actual = window.actualExpenseCostTotal(cost.id);
  const remaining = budget === null ? null : budget - actual;
  const recurrence = window.expenseRecurrence(cost.recurrence);

  return (
    <tr>
      <td>
        <LabelCell cost={cost} />
        {recurrence.unit && <span className="expenses-detail">{window.expenseAmountLabel(cost)}</span>}
      </td>
      <td>
        <EditableTagsCell
          tags={cost.categories}
          vocabulary={window.allFixedCostCategories()}
          addLabel="+ catégorie"
          onToggle={(category) => {
            const index = cost.categories.indexOf(category);
            if (index === -1) cost.categories.push(category);
            else cost.categories.splice(index, 1);
            window.saveNow();
            window.render();
          }}
        />
      </td>
      <td>
        {budget === null ? (
          <span className="expenses-muted">Hors scénario retenu</span>
        ) : (
          window.formatEuros(budget)
        )}
      </td>
      <td className="expenses-number">{window.formatEuros(actual)}</td>
      <td
        className={`expenses-number ${remaining !== null && remaining < 0 ? 'expenses-over' : 'expenses-under'}`}
      >
        {remaining === null ? '—' : window.formatEuros(remaining)}
      </td>
      <td className="expenses-actions">
        <button
          type="button"
          className="icon-btn"
          title="Modifier"
          aria-label={`Modifier ${cost.label}`}
          onClick={() => window.openModal('charge', cost.id)}
        >
          <Icon name="pencil" />
        </button>
      </td>
    </tr>
  );
}
