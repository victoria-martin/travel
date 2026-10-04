import type { Scenario } from '@/store/types';
import { useScenarioMoney } from '../hooks/useScenarioMoney';
import { useScenarioRoad } from '../hooks/useScenarioRoad';
import { useScenarioRoute } from '../hooks/useScenarioRoute';
import { AccommodationDetailRows } from './TotalBlock/AccommodationDetailRows';
import { AttractionDetailRows } from './TotalBlock/AttractionDetailRows';
import { ChargeDetailRows } from './TotalBlock/ChargeDetailRows';
import { RecapGroup } from './TotalBlock/RecapGroup';
import { RecapRow } from './TotalBlock/RecapRow';
import { TransportDetailRows } from './TotalBlock/TransportDetailRows';

export function TotalBlock({ scenario }: { scenario: Scenario }) {
  const money = useScenarioMoney(scenario);
  const road = useScenarioRoad(scenario);
  const route = useScenarioRoute(scenario, road.points);
  const travelers = window.travelerCount();
  const guestPoints = money.accommodations.guestPoints.amount;

  return (
    <div className="acc-recap">
      <div className="acc-recap-title">Total général</div>
      <RecapGroup
        foldKey="accommodations"
        title="Hébergements"
        total={window.formatEuros(money.accommodations.euros.amount)}
      >
        <AccommodationDetailRows scenario={scenario} route={route} />
      </RecapGroup>
      {guestPoints > 0 && (
        <RecapRow label="Hébergements en GP" amount={window.formatGuestPoints(guestPoints)} />
      )}
      <RecapGroup foldKey="charges" title="Charges" total={window.formatEuros(money.charges)}>
        <ChargeDetailRows scenario={scenario} />
      </RecapGroup>
      <RecapGroup foldKey="transport" title="Transport" total={window.formatEuros(money.transport)}>
        <TransportDetailRows scenario={scenario} />
      </RecapGroup>
      <RecapGroup
        foldKey="attractions"
        title="Attractions"
        total={window.formatEuros(money.attractions)}
      >
        <AttractionDetailRows scenario={scenario} />
      </RecapGroup>
      <div className="acc-recap-row acc-recap-total">
        <span>Total</span>
        <span className="acc-recap-nights">{window.nightsLabel(money.nights)}</span>
        <strong>{window.formatCosts(money.total)}</strong>
      </div>
      {travelers > 0 && (
        <RecapRow
          label={`Par personne (${travelers})`}
          amount={window.formatEuros(money.perTraveler)}
          className="acc-recap-sub"
        />
      )}
    </div>
  );
}
