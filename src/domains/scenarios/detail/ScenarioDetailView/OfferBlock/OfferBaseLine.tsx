import type { Offer, Scenario } from '@/store/types';

// The base price, options excluded: without it nothing said whether the block total already included it.
export function OfferBaseLine({ scenario, offer }: { scenario: Scenario; offer: Offer }) {
  const days = window.totalDays(scenario);
  const price = window.offerDayPrice(offer);
  const note = price
    ? `${window.offerDayPriceLabel(offer)} × ${days} j`
    : 'prix par jour non renseigné';
  return (
    <div className="expense-line">
      <span className="expense-label">
        Location<span className="expense-unit">{note}</span>
      </span>
      <strong>{price ? window.formatEuros(price * days) : '—'}</strong>
    </div>
  );
}
