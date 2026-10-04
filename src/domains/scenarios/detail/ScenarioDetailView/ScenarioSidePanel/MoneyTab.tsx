import { LegacyMarkup } from '@/shared/LegacyMarkup';
import type { Scenario } from '@/store/types';
import { OfferBlock } from '../OfferBlock';
import { TransportsBlock } from '../TransportsBlock';

export function MoneyTab({ scenario }: { scenario: Scenario }) {
  const html = [window.scenarioExpensesBlock(scenario), window.scenarioTotalBlock(scenario)].join(
    '',
  );
  return (
    <>
      <OfferBlock scenario={scenario} />
      <TransportsBlock scenario={scenario} />
      <LegacyMarkup html={html} />
    </>
  );
}
