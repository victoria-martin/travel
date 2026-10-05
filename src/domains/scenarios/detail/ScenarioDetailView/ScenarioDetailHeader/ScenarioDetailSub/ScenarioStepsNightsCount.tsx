import type { Scenario } from '@/store/types';

export function ScenarioStepsNightsCount({ scenario }: { scenario: Scenario }) {
  const visibleCount = scenario.steps.filter((step) => window.isStepVisible(scenario, step)).length;
  const nights = window.totalNights(scenario);
  return (
    <>
      {visibleCount} étape{visibleCount > 1 ? 's' : ''} · {nights} nuit{nights === 1 ? '' : 's'}
    </>
  );
}
