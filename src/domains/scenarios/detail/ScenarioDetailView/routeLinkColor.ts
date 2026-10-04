import type { Scenario, Step } from '@/store/types';

export function routeLinkColor(scenario: Scenario, step: Step): string {
  if (!window.trailColorByType())
    return window.stepStatusBackground(window.stepStatus(scenario, step));
  const accommodation = window.getAccommodation(step.accommodationId);
  return window.accType(accommodation?.type ?? '').color;
}
