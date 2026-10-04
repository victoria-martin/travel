import type { Step } from '@/store/types';

export function routeLinkName(step: Step): string {
  return step.name || window.stepPlace(step)?.name || 'Sans lieu';
}
