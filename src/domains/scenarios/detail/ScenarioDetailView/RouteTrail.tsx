import type { Scenario } from '@/store/types';
import { RouteTrailLink } from './RouteTrail/RouteTrailLink';

export function RouteTrail({ scenario }: { scenario: Scenario }) {
  const steps = window.visibleSteps(scenario);
  if (steps.length < 2) return null;
  return (
    <div className="route-trail">
      {steps.map((step, rank) => (
        <RouteTrailLink key={step.id} scenario={scenario} step={step} rank={rank} />
      ))}
    </div>
  );
}
