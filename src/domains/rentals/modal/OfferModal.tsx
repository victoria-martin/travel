import { LegacyMarkup } from '@/shared/LegacyMarkup';
import { SelectField } from '@/shared/form-fields/SelectField';
import { TextField } from '@/shared/form-fields/TextField';
import { TextareaField } from '@/shared/form-fields/TextareaField';
import { FieldRow } from '@/shared/layout/FieldRow';
import { CloseModalButton } from '@/shared/modal/CloseModalButton';
import { ModalSaveButton } from '@/shared/modal/ModalSaveButton';
import { ModalTitle } from '@/shared/modal/ModalTitle';
import type { Offer } from '@/store/types';

/*
  Port d'offerForm/saveOffer (js/views/rentals/modal/{offer-form,offer-save}.js). Trois blocs
  restent délégués en LegacyMarkup, pas réimplémentés ici : le select loueur (providerSelectField,
  création rapide inline), le select modèle et les options du loueur — chacun se repeint depuis
  l'extérieur de React (repaintOfferProvider/-Model/-Options, js/views/rentals/modal/{offer-form,
  options-field}.js) au changement de loueur, un mécanisme stateful déjà en place qu'on ne recâble
  pas. Le statut, lui, est un dict simple sans "＋ Ajouter" (CAR_STATUSES) : un SelectField ordinaire
  suffit, pas de WordSelectField. Tout le reste est non contrôlé, saveOffer (inchangée) lit les ids
  par getElementById.
*/
export function OfferModal({ payload }: { payload: Offer }) {
  const statusOptions = Object.entries(window.CAR_STATUSES).map(([key, status]) => ({
    value: key,
    label: `${status.emoji} ${status.label}`,
  }));

  return (
    <>
      <ModalTitle isNew={!payload.id} subject="une offre" />
      <FieldRow>
        <LegacyMarkup
          html={window.providerSelectField(
            'offer-provider',
            'car',
            payload.providerId,
            window.repaintOfferProvider,
          )}
        />
        <SelectField
          id="offer-status"
          label="Statut"
          defaultValue={payload.status}
          placeholder={`${window.UNSET_CAR_STATUS.emoji} ${window.UNSET_CAR_STATUS.label}`}
          options={statusOptions}
        />
      </FieldRow>
      <div className="field">
        <label>Modèle</label>
        <div id="offer-model-field" dangerouslySetInnerHTML={{ __html: window.offerModelSelect(payload) }} />
      </div>
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
        <TextField id="offer-pickup-time" label="Heure" type="time" defaultValue={payload.pickupTime} />
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
      <LegacyMarkup html={window.offerOptionsField(payload)} />
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
