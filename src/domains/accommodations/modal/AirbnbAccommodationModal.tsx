import { LegacyMarkup } from '@/shared/LegacyMarkup';
import { WordSelectField } from '@/shared/WordSelectField';
import { TextField } from '@/shared/form-fields/TextField';
import { TextareaField } from '@/shared/form-fields/TextareaField';
import { FieldRow } from '@/shared/layout/FieldRow';
import { CloseModalButton } from '@/shared/modal/CloseModalButton';
import { ModalSaveButton } from '@/shared/modal/ModalSaveButton';
import type { Accommodation } from '@/store/types';

/*
  Port de airbnbAccommodationForm (js/views/accommodations/modal/airbnb-form.js) — la porte
  Airbnb : le type est celui de la porte (posé par MODAL_TYPES à l'ouverture), pas de champ
  #f-type ici. Le prix reste à saisir, Airbnb ne le sert pas dans sa page. Toujours une création
  (saveAccommodation('') inchangé).
*/
export function AirbnbAccommodationModal({ payload }: { payload: Accommodation }) {
  window.wordSelectValues['f-status'] = payload.status || '';

  return (
    <>
      <h3>Ajouter depuis Airbnb</h3>
      <TextField
        id="f-link"
        label="Lien Airbnb"
        defaultValue={payload.link}
        placeholder="https://..."
        onPaste={() => window.importAirbnbPaste()}
        onChange={() => window.importAirbnbLink()}
      />
      <TextField id="f-name" label="Nom" defaultValue={payload.name} />
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
