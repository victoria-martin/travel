import type { Scenario } from '@/store/types';
import type { ScenarioRoute } from '@/domains/scenarios/hooks/useScenarioRoute';
import { RouteStripLink } from './RouteStrip/RouteStripLink';

export function RouteStrip({ scenario, route }: { scenario: Scenario; route: ScenarioRoute }) {
  const steps = window.visibleSteps(scenario);
  if (steps.length < 2) return null;
  return (
    <div className="route-strip">
      {steps.map((step, rank) => (
        <RouteStripLink key={step.id} scenario={scenario} step={step} rank={rank} route={route} />
      ))}
    </div>
  );
}
