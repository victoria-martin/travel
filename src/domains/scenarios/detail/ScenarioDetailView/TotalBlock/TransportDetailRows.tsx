import type { Scenario } from '@/store/types';
import { RecapRow } from './RecapRow';
import { RoadDetailRows } from './RoadDetailRows';
import { RoadRow } from './RoadRow';

// The chosen car (day price then each option), then the road, which keeps its own subtotal row.
export function TransportDetailRows({ scenario }: { scenario: Scenario }) {
  const offer = window.getScenarioOffer(scenario);
  const days = window.totalDays(scenario);
  const price = offer ? window.offerDayPrice(offer) : 0;
  return (
    <>
      {offer && (
        <RoadRow
          label="Voiture"
          note={
            price
              ? `${window.offerDayPriceLabel(offer)} × ${days} j`
              : 'prix par jour non renseigné'
          }
          amount={price ? window.formatEuros(price * days) : '—'}
        />
      )}
      {offer &&
        window.scenarioOfferOptions(scenario).map((option) => {
          const unit = window.providerOptionUnit(option.unit);
          return (
            <RoadRow
              key={option.id}
              label={option.label || 'Sans libellé'}
              note={unit.suffix ? `${option.amount} € ${unit.suffix}` : ''}
              amount={window.formatEuros(window.optionAmount(option, days))}
            />
          );
        })}
      <RecapRow
        label="Route"
        amount={window.formatEuros(window.scenarioRoadTotal(scenario))}
        className="acc-recap-sub acc-recap-subtotal"
      />
      <RoadDetailRows scenario={scenario} />
    </>
  );
}
