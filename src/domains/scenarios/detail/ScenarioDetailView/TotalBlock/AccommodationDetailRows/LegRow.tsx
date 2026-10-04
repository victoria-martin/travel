import type { Scenario, Step } from '@/store/types';
import type { ScenarioRoute } from '../../../hooks/useScenarioRoute';
import { durationLabel } from '../../durationLabel';
import { RecapIconLabel } from './RecapIconLabel';

// The road driven from the previous place: its own row, outside the three-column grid.
export function LegRow({
  scenario,
  step,
  route,
}: {
  scenario: Scenario;
  step: Step;
  route: ScenarioRoute;
}) {
  const rank = window.stepLegRank(scenario, step);
  if (rank === null) return null;
  const leg = route.route?.legs[rank];
  const text =
    route.status === 'error'
      ? '⚠️'
      : leg
        ? `${durationLabel(leg.duration)} · ⛽ ${window.formatEuros(window.legFuelCost(scenario, leg))} · 🛣️ ${window.formatEuros(window.legTollCost(leg))}`
        : '';
  return (
    <div className="acc-recap-leg">
      <RecapIconLabel icon="🚗">
        <span className="step-leg">{text}</span>
      </RecapIconLabel>
    </div>
  );
}
