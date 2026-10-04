import { LocateFields } from '@/shared/form-fields/LocateFields';
import { WordSelectField } from '@/shared/WordSelectField';
import { TextField } from '@/shared/form-fields/TextField';
import { TextareaField } from '@/shared/form-fields/TextareaField';
import { FieldRow } from '@/shared/layout/FieldRow';
import { CloseModalButton } from '@/shared/modal/CloseModalButton';
import { ModalSaveButton } from '@/shared/modal/ModalSaveButton';
import type { Accommodation } from '@/store/types';

/*
  Port de bookingAccommodationForm (js/views/accommodations/modal/booking-form.js) — la porte
  Booking : le lien en tête, puis ce que l'annonce remplit. Toujours une création
  (saveAccommodation('') inchangé) : tags et coup de cœur se posent depuis la liste, pas ici.
*/
export function BookingAccommodationModal({ payload }: { payload: Accommodation }) {
  window.wordSelectValues['f-type'] = payload.type || '';
  window.wordSelectValues['f-status'] = payload.status || '';

  return (
    <>
      <h3>Ajouter depuis Booking</h3>
      <TextField
        id="f-booking-link"
        label="Lien Booking"
        defaultValue={payload.bookingLink}
        placeholder="https://..."
        onPaste={() => window.importBookingPaste()}
        onChange={() => window.importBookingLink()}
      />
      <FieldRow>
        <WordSelectField
          id="f-type"
          label="Type"
          bank="accommodationTypes"
          dict={window.ACCOMMODATION_TYPES}
          defaultValue={payload.type}
          unset={window.UNSET_ACCOMMODATION_TYPE}
          addLabel="Ajouter un type"
        />
        <TextField id="f-name" label="Nom" defaultValue={payload.name} />
      </FieldRow>
      <WordSelectField
        id="f-status"
        label="Statut"
        bank="accommodationStatuses"
        dict={window.ACCOMMODATION_STATUSES}
        defaultValue={payload.status}
        unset={window.UNSET_ACCOMMODATION_STATUS}
        addLabel="Ajouter un statut"
      />
      <LocateFields payload={payload} />
      <FieldRow>
        <TextField
          id="f-price"
          label="Prix"
          defaultValue={payload.price}
          title="Un calcul marche aussi : =625/4"
          onBlur={(event) => window.applyPriceFormula(event.currentTarget)}
        />
        <TextField id="f-dates" label="Dates" defaultValue={payload.dates} hint="ex. 12–14 juin" />
      </FieldRow>
      <TextareaField id="f-notes" label="Notes" rows={2} defaultValue={payload.notes} />
      <div className="modal-actions">
        <CloseModalButton />
        <ModalSaveButton onClick={() => window.saveAccommodation('')} />
      </div>
    </>
  );
}
