import type { Scenario, Step } from '@/store/types';
import type { ScenarioRoute } from '@/domains/scenarios/hooks/useScenarioRoute';
import { distanceLabel } from '@/domains/scenarios/distanceLabel';
import { durationLabel } from '@/domains/scenarios/durationLabel';

export function StepLeg({
  scenario,
  step,
  route,
}: {
  scenario: Scenario;
  step: Step | null;
  route: ScenarioRoute;
}) {
  const rank = window.stepLegRank(scenario, step);
  if (rank === null) return null;
  if (route.status === 'error') return <div className="step-leg">⚠️ Route indisponible</div>;
  const leg = route.route?.legs[rank];
  if (!leg)
    return (
      <div className="step-leg" aria-live="polite">
        Calcul de la route…
      </div>
    );

  return (
    <div className="step-leg">
      {durationLabel(leg.duration)} · {distanceLabel(leg.distance)}
    </div>
  );
}
