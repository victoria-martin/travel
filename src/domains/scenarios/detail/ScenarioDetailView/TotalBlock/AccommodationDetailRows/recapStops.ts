import type { Scenario, Step } from '@/store/types';

export type RecapStop =
  | { kind: 'stay'; at: number; step: Step; place: ReturnType<Window['nightsByPlace']>[number] }
  | { kind: 'passage'; at: number; step: Step };

// A revisited place stays on one row, at its first stay; a step without nights keeps its own row.
export function recapStops(scenario: Scenario): RecapStop[] {
  const stays: RecapStop[] = window.nightsByPlace(scenario).map((place) => ({
    kind: 'stay',
    at: place.firstStay,
    step: place.steps[0],
    place,
  }));
  const passages: RecapStop[] = window
    .visibleSteps(scenario)
    .map((step, at) => ({ kind: 'passage' as const, at, step }))
    .filter((stop) => window.stepNights(stop.step) === 0);
  return stays.concat(passages).sort((stopA, stopB) => stopA.at - stopB.at);
}
