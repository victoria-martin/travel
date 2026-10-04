import type { Scenario } from '@/store/types';
import { ExtraRecapRow } from './ExtraRecapRow';
import { RecapRow } from '@/domains/scenarios/recap/RecapRow';

// Expenses attached to the scenario, then expense lines set on its steps and groups.
export function ChargeDetailRows({ scenario }: { scenario: Scenario }) {
  const span = window.scenarioSpan(scenario);
  return (
    <>
      {window.getScenarioExpenses(scenario).map((cost) => (
        <RecapRow
          key={cost.id}
          label={window.costLabel(cost)}
          amount={window.formatEuros(window.expenseAmount(cost, span))}
          className="acc-recap-sub"
        />
      ))}
      {window.scenarioExtraCostLines(scenario).map((line) => (
        <ExtraRecapRow key={line.id} line={line} />
      ))}
    </>
  );
}
