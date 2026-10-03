import { Icon } from '@/shared/Icon';
import type { CarModel } from '@/store/types';

export function ConsumptionCell({ model }: { model: CarModel }) {
  if (!model.consumption) return <>—</>;
  return <>{window.formatRate(window.priceNumber(model.consumption))} L/100</>;
}

export function ProvidersCell({ model }: { model: CarModel }) {
  const providers = window.carModelProviders(model.id);
  if (!providers.length) return <>—</>;
  return (
    <span className="tag-chips">
      {providers.map((provider) => (
        <span className="tag-chip" key={provider.id}>
          {provider.name}
        </span>
      ))}
    </span>
  );
}

export function OffersCell({ model }: { model: CarModel }) {
  const offers = window.carModelOffers(model.id);
  if (!offers.length) return <>—</>;
  const cheapest = offers.find((offer) => window.offerDayPrice(offer));
  return (
    <>
      {[
        `${offers.length} offre${offers.length > 1 ? 's' : ''}`,
        cheapest ? `dès ${window.offerDayPriceLabel(cheapest)}` : '',
      ]
        .filter(Boolean)
        .join(' · ')}
    </>
  );
}

export function ActionsCell({ model }: { model: CarModel }) {
  return (
    <>
      <button
        type="button"
        className="icon-btn"
        title="Modifier"
        aria-label={`Modifier ${model.name}`}
        onClick={() => window.openModal('modele', model.id)}
      >
        <Icon name="pencil" />
      </button>
      <button
        type="button"
        className="icon-btn"
        title="Supprimer"
        aria-label={`Supprimer ${model.name}`}
        onClick={() => window.deleteItem('carModels', model.id)}
      >
        <Icon name="trash-2" />
      </button>
    </>
  );
}
