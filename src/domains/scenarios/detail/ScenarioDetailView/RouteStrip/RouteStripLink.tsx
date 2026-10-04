import type { Scenario, Step } from '@/store/types';
import type { ScenarioRoute } from '../../hooks/useScenarioRoute';
import { routeLinkColor } from '../routeLinkColor';
import { routeLinkName } from '../routeLinkName';
import { scrollToStepCard } from '../scrollToStepCard';
import { roadLegLabel } from './roadLegLabel';
import { stayRangeLabel } from './stayRangeLabel';

export function RouteStripLink({
  scenario,
  step,
  rank,
  route,
}: {
  scenario: Scenario;
  step: Step;
  rank: number;
  route: ScenarioRoute;
}) {
  const nights = window.stepNights(step);
  const name = routeLinkName(step);
  const roadLeg = roadLegLabel(scenario, step, route);
  return (
    <button
      type="button"
      className="route-strip-link"
      onClick={() => scrollToStepCard(step.id)}
      title={name}
    >
      <span className="route-strip-bar" style={{ background: routeLinkColor(scenario, step) }} />
      <span className="route-strip-row">
        <span className="route-strip-head">
          <span className="route-trail-letter">{window.stepLetter(rank)}</span>
          <span className="route-strip-name">{name}</span>
        </span>
        <span className="route-strip-nights">{window.nightsLabel(nights)}</span>
      </span>
      <span className="route-strip-row route-strip-meta">
        <span>{stayRangeLabel(window.stepArrival(scenario, rank), nights)}</span>
        {roadLeg !== null && <span className="step-leg">{roadLeg}</span>}
      </span>
    </button>
  );
}
