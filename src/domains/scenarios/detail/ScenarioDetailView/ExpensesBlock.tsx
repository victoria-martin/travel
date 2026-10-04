import { Button } from '@/shared/buttons/Button';
import { ScenarioExpenseDropdown } from '@/shared/select/ScenarioExpenseDropdown';
import { ToolbarFace } from '@/shared/toolbar/ToolbarFace';
import type { Scenario } from '@/store/types';
import { ExpenseRow } from './ExpensesBlock/ExpenseRow';

export function ExpensesBlock({ scenario }: { scenario: Scenario }) {
  const expenses = window.getScenarioExpenses(scenario);
  const span = window.scenarioSpan(scenario);
  return (
    <div className="scenario-extra scenario-extra-expenses">
      <div className="scenario-extra-head">
        <div className="acc-recap-title">Dépenses</div>
        {expenses.length > 0 && (
          <strong>{window.formatEuros(window.fixedCostsTotal(scenario))}</strong>
        )}
      </div>
      {expenses.length === 0 ? (
        <div className="scenario-extra-empty">
          Aucune dépense rattachée — celles du voyage restent sur la page Dépenses.
        </div>
      ) : (
        expenses.map((cost) => (
          <ExpenseRow key={cost.id} scenario={scenario} cost={cost} span={span} />
        ))
      )}
      <div className="scenario-extra-actions">
        <ScenarioExpenseDropdown scenario={scenario} />
        <Button
          size="small"
          title="Ajouter une dépense"
          ariaLabel="Ajouter une dépense"
          onClick={() => window.openModal('charge', '', scenario.id)}
        >
          <ToolbarFace icon="plus" label="Ajouter une dépense" />
        </Button>
      </div>
    </div>
  );
}
