import type { Scenario } from '@/store/types';
import type { ScenarioRoute } from '@/domains/scenarios/hooks/useScenarioRoute';
import { OfferBlock } from './OfferBlock';
import { ExpensesBlock } from './ExpensesBlock';
import { TotalBlock } from './TotalBlock';
import { TransportsBlock } from './TransportsBlock';

export function ScenarioSummary({ scenario, route }: { scenario: Scenario; route: ScenarioRoute }) {
  return (
    <div className="scenario-detail-money">
      <OfferBlock scenario={scenario} />
      <TransportsBlock scenario={scenario} />
      <ExpensesBlock scenario={scenario} />
      <TotalBlock scenario={scenario} />
      {route.status === 'error' && <p role="status">Tronçons routiers indisponibles.</p>}
    </div>
  );
}
