import type { Scenario } from '@/store/types';
import { useScenarioMoney } from '../hooks/useScenarioMoney';
import { RecapGroup } from './TotalBlock/RecapGroup';
import { RecapRow } from './TotalBlock/RecapRow';

export function TotalBlock({ scenario }: { scenario: Scenario }) {
  const money = useScenarioMoney(scenario);
  const travelers = window.travelerCount();
  const guestPoints = money.accommodations.guestPoints.amount;

  return (
    <div className="acc-recap">
      <div className="acc-recap-title">Total général</div>
      <RecapGroup
        foldKey="accommodations"
        title="Hébergements"
        total={window.formatEuros(money.accommodations.euros.amount)}
        rowsHtml={window.accommodationDetailRows(scenario)}
      />
      {guestPoints > 0 && (
        <RecapRow label="Hébergements en GP" amount={window.formatGuestPoints(guestPoints)} />
      )}
      <RecapGroup
        foldKey="charges"
        title="Charges"
        total={window.formatEuros(money.charges)}
        rowsHtml={window.chargeDetailRows(scenario)}
      />
      <RecapGroup
        foldKey="transport"
        title="Transport"
        total={window.formatEuros(money.transport)}
        rowsHtml={window.transportDetailRows(scenario)}
      />
      <RecapGroup
        foldKey="attractions"
        title="Attractions"
        total={window.formatEuros(money.attractions)}
        rowsHtml={window.attractionDetailRows(scenario)}
      />
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
