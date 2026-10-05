import type { Scenario } from '@/store/types';
import { ScenarioStartDateInput } from './ScenarioDetailSub/ScenarioStartDateInput';
import { ScenarioStepsNightsCount } from './ScenarioDetailSub/ScenarioStepsNightsCount';

export function ScenarioDetailSub({ scenario }: { scenario: Scenario }) {
  return (
    <div className="view-sub">
      <ScenarioStartDateInput scenario={scenario} />
      {' · '}
      <ScenarioStepsNightsCount scenario={scenario} />
    </div>
  );
}
