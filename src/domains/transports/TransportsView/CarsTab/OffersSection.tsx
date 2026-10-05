import { DataTable } from '@/shared/DataTable/DataTable';
import { Icon } from '@/shared/Icon';
import { normalizeSearch } from '@/shared/normalizeSearch';
import { SearchInput } from '@/shared/SearchInput';
import { ColumnPicker } from '@/shared/menu/ColumnPicker';
import type { CarModel, Offer } from '@/store/types';
import { useTravelStore } from '@/store/useTravelStore';
import { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { offerColumns } from './OffersSection/columns';

function offerSearchText(offer: Offer, carModels: CarModel[]): string {
  const model = carModels.find((candidate) => candidate.id === offer.modelId);
  return [
    window.offerModelName(offer),
    window.providerName(offer.providerId),
    offer.location,
    window.carFuel(model?.fuel || '').label,
    window.carGearbox(model?.gearbox || '').label,
    ...window.offerOptions(offer).map((option) => option.label),
  ]
    .filter(Boolean)
    .join(' ');
}

export function OffersSection() {
  const offers = useTravelStore(useShallow((store) => window.ofCurrentTravel(store.data.offers)));
  const carModels = useTravelStore(
    useShallow((store) => window.ofCurrentTravel(store.data.carModels)),
  );
  const [query, setQuery] = useState('');
  const wanted = normalizeSearch(query);
  const items = offers
    .filter(
      (offer) => !wanted || normalizeSearch(offerSearchText(offer, carModels)).includes(wanted),
    )
    .sort((offerA, offerB) => {
      const modelDifference = window
        .offerModelName(offerA)
        .localeCompare(window.offerModelName(offerB), 'fr');
      if (modelDifference) return modelDifference;
      const priceA = window.offerDayPrice(offerA);
      const priceB = window.offerDayPrice(offerB);
      if (!priceA || !priceB) return (priceA ? 0 : 1) - (priceB ? 0 : 1);
      return priceA - priceB;
    });
  const columns = offerColumns(carModels);
  const hidden = window.hiddenColumns('locations');
  const visibleColumns = columns.filter((column) => column.locked || !hidden.includes(column.key));

  return (
    <section className="list-section">
      <div className="list-section-head">
        <h3 className="list-section-title">Offres</h3>
        <div className="list-section-actions">
          <SearchInput value={query} onChange={setQuery} />
          <ColumnPicker kind="locations" columns={columns} />
          {/* TODO: create AddCarOfferButton */}
          <button
            type="button"
            className="btn btn-small"
            title="Ajouter une offre"
            onClick={() => window.openModal('voiture')}
          >
            <span className="toolbar-icon">
              <Icon name="plus" />
            </span>
            <span className="toolbar-label">Offre</span>
          </button>
        </div>
      </div>
      {items.length ? (
        <DataTable
          columns={visibleColumns}
          items={items}
          onRowClick={(offer) => window.openSheet('voiture', offer.id)}
        />
      ) : (
        <div className="empty-state">
          <strong>Aucune offre</strong>
          Relève ce qu’un loueur demande : un modèle, un prix par jour.
        </div>
      )}
    </section>
  );
}
