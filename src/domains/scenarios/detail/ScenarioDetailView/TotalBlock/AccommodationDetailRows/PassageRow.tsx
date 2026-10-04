import type { Scenario, Step } from '@/store/types';
import { RecapIconLabel } from './RecapIconLabel';

export function PassageRow({ scenario, step, at }: { scenario: Scenario; step: Step; at: number }) {
  const arrival = window.stepArrival(scenario, at);
  return (
    <div className="acc-recap-row acc-recap-sub">
      <span>
        <RecapIconLabel icon="">{step.name || 'Sans nom'}</RecapIconLabel>
      </span>
      <span className="acc-recap-nights">{arrival ? window.formatStepDay(arrival) : ''}</span>
      <span></span>
    </div>
  );
}
