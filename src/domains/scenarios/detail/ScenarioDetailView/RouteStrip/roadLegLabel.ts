import type { Scenario, Step } from '@/store/types';
import type { ScenarioRoute } from '../../hooks/useScenarioRoute';
import { distanceLabel } from '../distanceLabel';
import { durationLabel } from '../durationLabel';

export function roadLegLabel(scenario: Scenario, step: Step, route: ScenarioRoute): string | null {
  const rank = window.stepLegRank(scenario, step);
  if (rank === null) return null;
  if (route.status === 'error') return '⚠️';
  const leg = route.route?.legs[rank];
  return leg ? `${distanceLabel(leg.distance)} · ${durationLabel(leg.duration)}` : '';
}
