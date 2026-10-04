import { useScenarioMoney } from '@/domains/scenarios/hooks/useScenarioMoney';
import { useScenarioRoad } from '@/domains/scenarios/hooks/useScenarioRoad';
import { useScenarioRoute } from '@/domains/scenarios/hooks/useScenarioRoute';
import { AccommodationDetailRows } from '@/domains/scenarios/recap/AccommodationDetailRows';
import { RecapRow } from '@/domains/scenarios/recap/RecapRow';
import type { Scenario } from '@/store/types';

// Read at a glance against its neighbour: accommodation detail, then one row per family; the rest of the detail lives in the scenario.
export function CompareCard({ scenario }: { scenario: Scenario }) {
  const money = useScenarioMoney(scenario);
  const road = useScenarioRoad(scenario);
  const route = useScenarioRoute(scenario, road.points);
  const guestPoints = money.accommodations.guestPoints.amount;
  return (
    <div className="acc-recap scenario-compare-card">
      <div className="scenario-compare-name">{scenario.name}</div>
      <div className="acc-recap-title">Hébergements</div>
      <AccommodationDetailRows scenario={scenario} route={route} />
      <RecapRow
        label="Total hébergements"
        amount={window.formatEuros(money.accommodations.euros.amount)}
      />
      {guestPoints > 0 && (
        <RecapRow label="Hébergements en GP" amount={window.formatGuestPoints(guestPoints)} />
      )}
      <RecapRow label="Charges" amount={window.formatEuros(money.charges)} />
      <RecapRow label="Transport" amount={window.formatEuros(money.transport)} />
      <RecapRow label="Attractions" amount={window.formatEuros(money.attractions)} />
      <div className="acc-recap-row acc-recap-total">
        <span>Total</span>
        <span className="acc-recap-nights">{window.nightsLabel(money.nights)}</span>
        <strong>{window.formatCosts(money.total)}</strong>
      </div>
    </div>
  );
}
