import type { Scenario } from '@/store/types';

export function ScenarioStartDateInput({ scenario }: { scenario: Scenario }) {
  return (
    <input
      className="scenario-start-date"
      type="date"
      value={scenario.startDate || ''}
      aria-label="Date de départ du scénario"
      onChange={(event) => window.setScenarioStartDate(scenario.id, event.target.value)}
    />
  );
}
