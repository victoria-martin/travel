import type { Scenario, Step } from '@/store/types';
import { routeLinkColor } from '../routeLinkColor';
import { routeLinkName } from '../routeLinkName';
import { scrollToStepCard } from '../scrollToStepCard';

export function RouteTrailLink({
  scenario,
  step,
  rank,
}: {
  scenario: Scenario;
  step: Step;
  rank: number;
}) {
  const nights = window.stepNights(step);
  const arrival = window.stepArrival(scenario, rank);
  const meta = [window.nightsLabel(nights), arrival ? window.formatStepDay(arrival) : '']
    .filter(Boolean)
    .join(' · ');
  const name = routeLinkName(step);
  // A step without nights is a crossing: it keeps a narrow link rather than none.
  return (
    <button
      type="button"
      className="route-trail-link"
      style={{ flex: nights + 1 }}
      onClick={() => scrollToStepCard(step.id)}
      title={name}
    >
      <span className="route-trail-bar" style={{ background: routeLinkColor(scenario, step) }} />
      <span className="route-trail-head">
        <span className="route-trail-letter">{window.stepLetter(rank)}</span>
        <span className="route-trail-name">{name}</span>
      </span>
      <span className="route-trail-meta">{meta}</span>
    </button>
  );
}
