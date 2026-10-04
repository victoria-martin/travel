import { SelectField } from '@/shared/form-fields/SelectField';
import { TextField } from '@/shared/form-fields/TextField';
import { TextareaField } from '@/shared/form-fields/TextareaField';
import { FieldRow } from '@/shared/layout/FieldRow';
import { CloseModalButton } from '@/shared/modal/CloseModalButton';
import { ModalSaveButton } from '@/shared/modal/ModalSaveButton';
import { ModalTitle } from '@/shared/modal/ModalTitle';
import { ProviderSelectField } from '@/shared/form-fields/ProviderSelectField';
import type { Offer } from '@/store/types';
import { useState } from 'react';
import { OfferModelField } from './OfferModal/OfferModelField';
import { OfferOptionsField } from './OfferModal/OfferOptionsField';

// Port d'offerForm/saveOffer (js/views/rentals/modal/{offer-form,offer-save}.js) — saveOffer
// (inchangée) lit les champs par id. Le loueur décide des modèles et des options proposés : en
// changer vide les options cochées, comme avant.
export function OfferModal({ payload }: { payload: Offer }) {
  const [providerId, setProviderId] = useState(payload.providerId);
  const statusOptions = Object.entries(window.CAR_STATUSES).map(([key, status]) => ({
    value: key,
    label: `${status.emoji} ${status.label}`,
  }));

  return (
    <>
      <ModalTitle isNew={!payload.id} subject="une offre" />
      <FieldRow>
        <ProviderSelectField
          id="offer-provider"
          mode="car"
          value={providerId}
          onChange={(id) => {
            payload.providerId = id;
            payload.optionIds = [];
            setProviderId(id);
          }}
        />
        <SelectField
          id="offer-status"
          label="Statut"
          defaultValue={payload.status}
          placeholder={`${window.UNSET_CAR_STATUS.emoji} ${window.UNSET_CAR_STATUS.label}`}
          options={statusOptions}
        />
      </FieldRow>
      <OfferModelField payload={payload} providerId={providerId} />
      <TextField
        id="offer-location"
        label="Lieu de prise en charge"
        defaultValue={payload.location}
      />
      <FieldRow>
        <TextField
          id="offer-pickup-date"
          label="Prise en charge"
          type="date"
          defaultValue={payload.pickupDate}
        />
        <TextField
          id="offer-pickup-time"
          label="Heure"
          type="time"
          defaultValue={payload.pickupTime}
        />
      </FieldRow>
      <FieldRow>
        <TextField
          id="offer-dropoff-date"
          label="Restitution"
          type="date"
          defaultValue={payload.dropoffDate}
        />
        <TextField
          id="offer-dropoff-time"
          label="Heure"
          type="time"
          defaultValue={payload.dropoffTime}
        />
      </FieldRow>
      <OfferOptionsField key={providerId} payload={payload} providerId={providerId} />
      <TextField id="offer-price-day" label="Prix par jour" defaultValue={payload.pricePerDay} />
      <TextField id="offer-link" label="Lien" defaultValue={payload.link} />
      <TextareaField id="offer-notes" label="Notes" rows={2} defaultValue={payload.notes} />
      <div className="modal-actions">
        <CloseModalButton />
        <ModalSaveButton onClick={() => window.saveOffer(payload.id || '')} />
      </div>
    </>
  );
}
