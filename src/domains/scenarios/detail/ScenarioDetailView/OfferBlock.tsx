import { Icon } from '@/shared/Icon';
import { ScenarioOfferDropdown } from '@/shared/select/ScenarioOfferDropdown';
import type { Scenario } from '@/store/types';
import { useTravelStore } from '@/store/useTravelStore';
import { OfferBaseLine } from './OfferBlock/OfferBaseLine';
import { OfferOptionLine } from './OfferBlock/OfferOptionLine';

// Options are ticked on the scenario, not on the offer: two scenarios compare two insurances on the same car.
export function OfferBlock({ scenario }: { scenario: Scenario }) {
  const store = useTravelStore();
  const offers = window.ofCurrentTravel(store.data.offers);
  const offer = window.getScenarioOffer(scenario);
  const options = offer ? (window.getProvider(offer.providerId)?.options ?? []) : [];
  const days = window.totalDays(scenario);

  return (
    <div className="scenario-extra">
      <div className="scenario-extra-head">
        <div className="acc-recap-title">
          Voiture
          {offer && (
            <button
              type="button"
              className="sheet-btn"
              title="Ouvrir la fiche"
              onClick={() => window.openOfferSheet(offer.id)}
            >
              <Icon name="arrow-up-right" />
            </button>
          )}
        </div>
        {offer && <strong>{window.formatEuros(window.scenarioOfferTotal(scenario))}</strong>}
      </div>
      {offers.length === 0 ? (
        <div className="scenario-extra-empty">
          Aucune offre relevée — ajoute-en une depuis l'onglet Voitures.
        </div>
      ) : (
        <>
          <ScenarioOfferDropdown scenario={scenario} offers={offers} />
          {offer && <OfferBaseLine scenario={scenario} offer={offer} />}
          {options.map((option) => (
            <OfferOptionLine key={option.id} scenario={scenario} option={option} days={days} />
          ))}
        </>
      )}
    </div>
  );
}
