import type { Scenario, Step } from '../../../../store/types';
import type { ScenarioRoute } from '../hooks/useScenarioRoute';

function durationLabel(seconds: number): string {
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min`;
  return `${Math.floor(minutes / 60)}h${String(minutes % 60).padStart(2, '0')}`;
}

function distanceLabel(meters: number): string {
  const kilometers = meters / 1000;
  return `${kilometers < 10 ? kilometers.toFixed(1).replace('.', ',') : Math.round(kilometers)} km`;
}

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
