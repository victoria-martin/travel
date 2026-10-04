import { LegacyMarkup } from '@/shared/LegacyMarkup';
import type { Scenario } from '@/store/types';
import { OfferBlock } from '../OfferBlock';

export function MoneyTab({ scenario }: { scenario: Scenario }) {
  const html = [
    window.scenarioTransportsBlock(scenario),
    window.scenarioExpensesBlock(scenario),
    window.scenarioTotalBlock(scenario),
  ].join('');
  return (
    <>
      <OfferBlock scenario={scenario} />
      <LegacyMarkup html={html} />
    </>
  );
}
