import type { Scenario } from '@/store/types';
import { distanceLabel } from '@/domains/scenarios/distanceLabel';
import { RoadFuelCostRow } from '../RoadFuelCostRow';
import { RoadTollCostRow } from '../RoadTollCostRow';
import { RoadRow } from './RoadRow';

// Each row restates the rate its amount comes from: that is what makes an estimate re-readable.
export function RoadDetailRows({ scenario }: { scenario: Scenario }) {
  const kilometers = window.scenarioRoadKm(scenario);
  if (kilometers === null) return <RoadRow label="Distance" note="le tracé arrive…" amount="—" />;
  return (
    <>
      <RoadRow label="Distance" note="" amount={distanceLabel(kilometers * 1000)} />
      <RoadFuelCostRow scenario={scenario} />
      <RoadTollCostRow scenario={scenario} />
    </>
  );
}
