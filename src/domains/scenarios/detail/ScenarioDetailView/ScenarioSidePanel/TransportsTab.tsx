import type { Scenario } from '@/store/types';
import { OfferBlock } from '../OfferBlock';
import { RoadFuelCostRow } from '../RoadFuelCostRow';
import { RoadTollCostRow } from '../RoadTollCostRow';

export function TransportsTab({ scenario }: { scenario: Scenario }) {
  return (
    <>
      <div className="acc-recap-title">Transports</div>
      <OfferBlock scenario={scenario} />
      <div className="acc-recap">
        <RoadTollCostRow scenario={scenario} />
        <RoadFuelCostRow scenario={scenario} />
      </div>
    </>
  );
}
