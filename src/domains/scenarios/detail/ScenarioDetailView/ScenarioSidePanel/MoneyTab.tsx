import type { Scenario } from '@/store/types';
import { OfferBlock } from '../OfferBlock';
import { ExpensesBlock } from '../ExpensesBlock';
import { TotalBlock } from '../TotalBlock';
import { TransportsBlock } from '../TransportsBlock';

export function MoneyTab({ scenario }: { scenario: Scenario }) {
  return (
    <>
      <OfferBlock scenario={scenario} />
      <TransportsBlock scenario={scenario} />
      <ExpensesBlock scenario={scenario} />
      <TotalBlock scenario={scenario} />
    </>
  );
}
