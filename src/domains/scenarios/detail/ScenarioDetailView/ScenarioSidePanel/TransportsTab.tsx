import { LegacyMarkup } from '@/shared/LegacyMarkup';
import type { Scenario } from '@/store/types';
import { OfferBlock } from '../OfferBlock';

export function TransportsTab({ scenario }: { scenario: Scenario }) {
  return (
    <>
      <div className="acc-recap-title">Transports</div>
      <OfferBlock scenario={scenario} />
      <div className="acc-recap">
        <LegacyMarkup html={window.roadTollCostRow(scenario) + window.roadFuelCostRow(scenario)} />
      </div>
    </>
  );
}
