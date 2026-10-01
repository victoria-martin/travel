import { useState } from 'react';
import { DataTable } from '../../../shared/DataTable/DataTable';
import type { Column } from '../../../shared/DataTable/types';
import { Icon } from '../../../shared/Icon';
import { normalizeSearch } from '../../../shared/normalizeSearch';
import { SearchField } from '../../../shared/SearchField';
import { VocabularyDropdown } from '../../../shared/VocabularyDropdown';
import { ColumnPicker } from '../../../shared/toolbar/ColumnPicker';
import type { CarModel, Offer } from '../../../store/types';
import { useTravelStore } from '../../../store/useTravelStore';

function carModelSearchText(model: CarModel): string {
  return [model.name, window.carFuel(model.fuel).label, window.carGearbox(model.gearbox).label].join(
    ' ',
  );
}

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

function OfferNotesCell({ offer }: { offer: Offer }) {
  return (
    <span
      className="editable"
      contentEditable
      suppressContentEditableWarning
      data-key={`offer:${offer.id}:notes`}
      data-placeholder="Notes…"
      onKeyDown={(event) => {
        if (event.key !== 'Enter') return;
        event.preventDefault();
        event.currentTarget.blur();
      }}
      onBlur={(event) => window.setOfferNotes(offer.id, event.currentTarget.innerText)}
    >
      {offer.notes || ''}
    </span>
  );
}

export function CarsTab() {
  const models = useTravelStore((store) => window.ofCurrentTravel(store.data.carModels));
  const offers = useTravelStore((store) => window.ofCurrentTravel(store.data.offers));
  const carModels = useTravelStore((store) => window.ofCurrentTravel(store.data.carModels));
  const [modelQuery, setModelQuery] = useState('');
  const [offerQuery, setOfferQuery] = useState('');
  const wantedModels = normalizeSearch(modelQuery);
  const wantedOffers = normalizeSearch(offerQuery);
  const visibleModels = models
    .filter(
      (model) =>
        !wantedModels || normalizeSearch(carModelSearchText(model)).includes(wantedModels),
    )
    .sort((modelA, modelB) => modelA.name.localeCompare(modelB.name, 'fr'));
  const visibleOffers = offers
    .filter(
      (offer) =>
        !wantedOffers || normalizeSearch(offerSearchText(offer, carModels)).includes(wantedOffers),
    )
    .sort((offerA, offerB) => {
      const modelDifference = window.offerModelName(offerA).localeCompare(window.offerModelName(offerB), 'fr');
      if (modelDifference) return modelDifference;
      const priceA = window.offerDayPrice(offerA);
      const priceB = window.offerDayPrice(offerB);
      if (!priceA || !priceB) return (priceA ? 0 : 1) - (priceB ? 0 : 1);
      return priceA - priceB;
    });

  const offerColumns: Column<Offer>[] = [
    {
      key: 'default',
      label: '',
      locked: true,
      render: (offer) => (
        <button
          type="button"
          className="icon-btn"
          style={{
            border: 'none',
            fontSize: 15,
            flexShrink: 0,
            color: offer.isDefault ? '#C98A3E' : 'var(--line)',
          }}
          title={offer.isDefault ? 'Ne plus être la voiture par défaut' : 'Voiture par défaut'}
          aria-label={offer.isDefault ? 'Ne plus être la voiture par défaut' : 'Voiture par défaut'}
          onClick={() => window.setDefaultOffer(offer.id)}
        >
          <Icon name={offer.isDefault ? 'circle-dot' : 'circle'} />
        </button>
      ),
    },
    {
      key: 'model',
      label: 'Modèle',
      locked: true,
      sortValue: (offer) => window.offerModelName(offer).toLocaleLowerCase('fr'),
      render: (offer) => (
        <>
          {window.offerModelName(offer) || '—'}
          <div className="row-notes">
            <OfferNotesCell offer={offer} />
          </div>
        </>
      ),
    },
    {
      key: 'provider',
      label: 'Loueur',
      sortValue: (offer) => window.providerName(offer.providerId).toLocaleLowerCase('fr'),
      render: (offer) => window.providerName(offer.providerId) || '—',
    },
    {
      key: 'place',
      label: 'Lieu',
      sortValue: (offer) => offer.location.toLocaleLowerCase('fr'),
      render: (offer) => offer.location || '—',
    },
    {
      key: 'dates',
      label: 'Dates',
      sortValue: (offer) => offer.pickupDate || '9999',
      render: (offer) => window.offerDatesLabel(offer).join(' · ') || '—',
    },
    {
      key: 'fuel',
      label: 'Motorisation',
      render: (offer) => {
        const model = carModels.find((candidate) => candidate.id === offer.modelId);
        if (!model) return '—';
        return (
          <VocabularyDropdown
            className="fuel-dropdown"
            dict={window.CAR_FUELS}
            current={window.carFuel(model.fuel)}
            emptyOption={window.UNSET_CAR_FUEL}
            onPick={(fuel) => window.setCarModelFuel(model.id, fuel)}
          />
        );
      },
    },
    {
      key: 'gearbox',
      label: 'Boîte',
      render: (offer) => {
        const model = carModels.find((candidate) => candidate.id === offer.modelId);
        if (!model) return '—';
        return (
          <VocabularyDropdown
            className="gearbox-dropdown"
            dict={window.CAR_GEARBOXES}
            current={window.carGearbox(model.gearbox)}
            emptyOption={window.UNSET_CAR_GEARBOX}
            onPick={(gearbox) => window.setCarModelGearbox(model.id, gearbox)}
          />
        );
      },
    },
    {
      key: 'status',
      label: 'Statut',
      render: (offer) => (
        <VocabularyDropdown
          className="status-dropdown"
          dict={window.CAR_STATUSES}
          current={window.carStatus(offer.status)}
          onPick={(status) => window.setOfferStatus(offer.id, status)}
        />
      ),
    },
    {
      key: 'price',
      label: 'Prix',
      sortValue: (offer) => window.offerDayPrice(offer),
      render: (offer) => window.offerDayPriceLabel(offer),
    },
    {
      key: 'options',
      label: 'Options',
      render: (offer) => {
        const options = window.offerOptions(offer);
        return options.length ? (
          <>
            {options.map((option) => (
              <div className="provider-option" key={option.id}>
                {option.label}
              </div>
            ))}
          </>
        ) : (
          '—'
        );
      },
    },
    {
      key: 'link',
      label: 'Lien',
      render: (offer) =>
        offer.link ? (
          <a href={offer.link} target="_blank" rel="noreferrer" className="external-link">
            Voir
          </a>
        ) : (
          '—'
        ),
    },
    {
      key: 'actions',
      label: '',
      locked: true,
      render: (offer) => (
        <>
          <button
            type="button"
            className="icon-btn"
            title="Modifier"
            aria-label={`Modifier l’offre ${window.offerModelName(offer)}`}
            onClick={() => window.openModal('voiture', offer.id)}
          >
            <Icon name="pencil" />
          </button>
          <button
            type="button"
            className="icon-btn"
            title="Dupliquer"
            aria-label={`Dupliquer l’offre ${window.offerModelName(offer)}`}
            onClick={() => window.duplicateOffer(offer.id)}
          >
            ⧉
          </button>
          <button
            type="button"
            className="icon-btn"
            title="Supprimer"
            aria-label={`Supprimer l’offre ${window.offerModelName(offer)}`}
            onClick={() => window.deleteItem('offers', offer.id)}
          >
            <Icon name="trash-2" />
          </button>
        </>
      ),
    },
  ];

  const modelColumns: Column<CarModel>[] = [
    {
      key: 'name',
      label: 'Modèle',
      locked: true,
      sortValue: (model) => model.name.toLocaleLowerCase('fr'),
      render: (model) => model.name,
    },
    {
      key: 'fuel',
      label: 'Motorisation',
      sortValue: (model) => model.fuel,
      render: (model) => (
        <VocabularyDropdown
          className="fuel-dropdown"
          dict={window.CAR_FUELS}
          current={window.carFuel(model.fuel)}
          emptyOption={window.UNSET_CAR_FUEL}
          onPick={(fuel) => window.setCarModelFuel(model.id, fuel)}
        />
      ),
    },
    {
      key: 'gearbox',
      label: 'Boîte',
      sortValue: (model) => model.gearbox,
      render: (model) => (
        <VocabularyDropdown
          className="gearbox-dropdown"
          dict={window.CAR_GEARBOXES}
          current={window.carGearbox(model.gearbox)}
          emptyOption={window.UNSET_CAR_GEARBOX}
          onPick={(gearbox) => window.setCarModelGearbox(model.id, gearbox)}
        />
      ),
    },
    {
      key: 'consumption',
      label: 'Conso',
      sortValue: (model) => window.priceNumber(model.consumption),
      render: (model) =>
        model.consumption ? `${window.formatRate(window.priceNumber(model.consumption))} L/100` : '—',
    },
    {
      key: 'providers',
      label: 'Loueurs',
      sortValue: (model) => window.carModelProviders(model.id).length,
      render: (model) => {
        const providersForModel = window.carModelProviders(model.id);
        return providersForModel.length ? (
          <span className="tag-chips">
            {providersForModel.map((provider) => (
              <span className="tag-chip" key={provider.id}>
                {provider.name}
              </span>
            ))}
          </span>
        ) : (
          '—'
        );
      },
    },
    {
      key: 'offers',
      label: 'Offres',
      sortValue: (model) => window.carModelOffers(model.id).length,
      render: (model) => {
        const offersForModel = window.carModelOffers(model.id);
        if (!offersForModel.length) return '—';
        const cheapest = offersForModel.find((offer) => window.offerDayPrice(offer));
        return [
          `${offersForModel.length} offre${offersForModel.length > 1 ? 's' : ''}`,
          cheapest ? `dès ${window.offerDayPriceLabel(cheapest)}` : '',
        ]
          .filter(Boolean)
          .join(' · ');
      },
    },
    {
      key: 'actions',
      label: '',
      locked: true,
      render: (model) => (
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
      ),
    },
  ];

  const hiddenOffers = window.hiddenColumns('locations');
  const visibleOfferColumns = offerColumns.filter(
    (column) => column.locked || !hiddenOffers.includes(column.key),
  );
  const hiddenModels = window.hiddenColumns('modeles');
  const visibleModelColumns = modelColumns.filter(
    (column) => column.locked || !hiddenModels.includes(column.key),
  );

  return (
    <>
      <section className="list-section">
        <div className="list-section-head">
          <h3 className="list-section-title">Offres</h3>
          <div className="list-section-actions">
            <SearchField value={offerQuery} onChange={setOfferQuery} />
            <ColumnPicker kind="locations" columns={offerColumns} />
            <button
              type="button"
              className="toolbar-btn"
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
        {visibleOffers.length ? (
          <DataTable
            columns={visibleOfferColumns}
            items={visibleOffers}
            onRowClick={(offer) => window.openSheet('voiture', offer.id)}
          />
        ) : (
          <div className="empty-state">
            <strong>Aucune offre</strong>
            Relève ce qu’un loueur demande : un modèle, un prix par jour.
          </div>
        )}
      </section>
      <section className="list-section">
        <div className="list-section-head">
          <h3 className="list-section-title">Modèles</h3>
          <div className="list-section-actions">
            <SearchField value={modelQuery} onChange={setModelQuery} />
            <ColumnPicker kind="modeles" columns={modelColumns} />
            <button
              type="button"
              className="toolbar-btn"
              title="Ajouter un modèle"
              onClick={() => window.openModal('modele')}
            >
              <span className="toolbar-icon">
                <Icon name="plus" />
              </span>
              <span className="toolbar-label">Modèle</span>
            </button>
          </div>
        </div>
        {visibleModels.length ? (
          <DataTable columns={visibleModelColumns} items={visibleModels} />
        ) : (
          <div className="empty-state">
            <strong>Aucun modèle</strong>
            Ajoute un modèle, ou tape-le en relevant une offre : il rejoint le catalogue.
          </div>
        )}
      </section>
    </>
  );
}
