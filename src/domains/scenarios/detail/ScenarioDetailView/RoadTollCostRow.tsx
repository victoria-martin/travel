import type { Scenario } from '@/store/types';
import { RoadCostRow } from './RoadCostRow';

export function RoadTollCostRow({ scenario }: { scenario: Scenario }) {
  return (
    <RoadCostRow
      scenario={scenario}
      field="tollBudget"
      label="Péages"
      note={`${window.formatRate(window.travelTollRate())} €/km`}
      calculated={window.scenarioTollCalc(scenario)}
    />
  );
}
