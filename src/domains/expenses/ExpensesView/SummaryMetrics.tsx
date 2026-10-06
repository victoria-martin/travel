import type { Scenario } from '@/store/types';

export function SummaryMetrics({ scenario }: { scenario: Scenario | null }) {
  const budgetTotal = scenario ? window.scenarioBudgetTotal(scenario) : null;
  const actualTotal = window.actualExpensesTotal();
  const remaining = budgetTotal === null ? null : budgetTotal - actualTotal;

  return (
    <section className="expenses-summary" aria-label="Budget et dépenses réelles">
      <div className="expenses-metric">
        <span>Budget du scénario</span>
        <strong>{budgetTotal === null ? '—' : window.formatEuros(budgetTotal)}</strong>
        <small>
          {scenario
            ? `${window.getScenarioExpenses(scenario).length} postes budgétés`
            : 'Aucun scénario retenu'}
        </small>
      </div>
      <div className="expenses-metric">
        <span>Dépenses réelles</span>
        <strong>{window.formatEuros(actualTotal)}</strong>
        <small>{window.actualExpenses().length} dépenses datées</small>
      </div>
      <div
        className={`expenses-metric ${remaining !== null && remaining < 0 ? 'expenses-over' : ''}`}
      >
        <span>Budget restant</span>
        <strong>{remaining === null ? '—' : window.formatEuros(remaining)}</strong>
        <small>Budget moins dépenses réelles</small>
      </div>
    </section>
  );
}
