import { LegacyMarkup } from '@/shared/LegacyMarkup';
import { WordSelectField } from '@/shared/WordSelectField';
import { TextField } from '@/shared/form-fields/TextField';
import { TextareaField } from '@/shared/form-fields/TextareaField';
import { FieldRow } from '@/shared/layout/FieldRow';
import { CloseModalButton } from '@/shared/modal/CloseModalButton';
import { ModalSaveButton } from '@/shared/modal/ModalSaveButton';
import type { Accommodation } from '@/store/types';

/*
  Port de googleMapsAccommodationForm (js/views/accommodations/modal/google-maps-form.js) — la
  porte Google Maps : le lien en tête remplit nom et localisation via l'Apps Script, le reste se
  tape à la main comme sur les autres portes. Type éditable (Google Maps ne le scrape pas).
  Toujours une création (saveAccommodation('') inchangé).
*/
export function GoogleMapsAccommodationModal({ payload }: { payload: Accommodation }) {
  window.wordSelectValues['f-type'] = payload.type || '';
  window.wordSelectValues['f-status'] = payload.status || '';

  return (
    <>
      <h3>Ajouter depuis Google Maps</h3>
      <TextField
        id="f-maps-link"
        label="Lien Google Maps"
        defaultValue={payload.mapsLink}
        placeholder="https://..."
        onPaste={(event) => window.importGoogleMapsPaste(event.currentTarget, 'f-name')}
        onChange={(event) => window.importGoogleMapsLink(event.currentTarget, 'f-name')}
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
      <LegacyMarkup html={window.locateFields(payload)} />
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
