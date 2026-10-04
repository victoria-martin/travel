import { Icon } from '@/shared/Icon';
import { LegacyMarkup } from '@/shared/LegacyMarkup';
import { WordSelectField } from '@/shared/WordSelectField';
import { TagsField } from '@/shared/form-fields/TagsField';
import { TextField } from '@/shared/form-fields/TextField';
import { TextareaField } from '@/shared/form-fields/TextareaField';
import { FieldRow } from '@/shared/layout/FieldRow';
import { CloseModalButton } from '@/shared/modal/CloseModalButton';
import { ModalHeader } from '@/shared/modal/ModalHeader';
import { ModalSaveButton } from '@/shared/modal/ModalSaveButton';
import { ModalTitle } from '@/shared/modal/ModalTitle';
import type { Accommodation } from '@/store/types';
import { useState } from 'react';

/*
  Port d'accommodationForm/saveAccommodation (js/views/accommodations/modal/{form,save}.js) — le
  formulaire complet, pour éditer une fiche ou en créer une à la main. Les 4 portes d'import
  (Booking, HomeExchange, Airbnb, Google Maps) sont chacune un écran à part
  (BookingAccommodationModal, …) plutôt qu'un seul composant paramétré : champs présents, titre et
  ordre diffèrent trop d'une porte à l'autre pour une config commune
  (docs/archivé/react-migration-modales-plan.md). Type/statut passent par le mécanisme word-select existant
  (WordSelectField), comme AttractionModal. `locateFields` et la bannière hors-disponibilité
  restent en LegacyMarkup.
*/
export function AccommodationModal({ payload }: { payload: Accommodation }) {
  window.wordSelectValues['f-type'] = payload.type || '';
  window.wordSelectValues['f-status'] = payload.status || '';

  const [tags, setTags] = useState(payload.tags);

  function handleTagsChange(next: string[]) {
    setTags(next);
    payload.tags = next;
  }

  return (
    <>
      <ModalHeader>
        <ModalTitle isNew={!payload.id} subject="un hébergement" />
      </ModalHeader>
      <div className="modal-body-scroll">
        <LegacyMarkup
          html={window.outOfRangeBanner(window.accommodationSearchOutOfRange(payload))}
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
          <WordSelectField
            id="f-status"
            label="Statut"
            bank="accommodationStatuses"
            dict={window.ACCOMMODATION_STATUSES}
            defaultValue={payload.status}
            unset={window.UNSET_ACCOMMODATION_STATUS}
            addLabel="Ajouter un statut"
          />
        </FieldRow>
        <TextField id="f-name" label="Nom" defaultValue={payload.name} />
        <TextareaField id="f-notes" label="Notes" rows={2} defaultValue={payload.notes} />
        <TagsField
          label="Tags"
          tags={tags}
          vocabulary={window.allAccommodationTags()}
          onChange={handleTagsChange}
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
          <TextField
            id="f-dates"
            label="Dates"
            defaultValue={payload.dates}
            hint="ex. 12–14 juin"
          />
          <TextField
            id="f-check-in-time"
            label="Heure d'arrivée"
            type="time"
            defaultValue={payload.checkInTime}
          />
        </FieldRow>
        <FieldRow>
          <TextField
            id="f-available-from"
            label="Disponible du"
            type="date"
            defaultValue={payload.availableFrom}
          />
          <TextField
            id="f-available-to"
            label="Disponible au"
            type="date"
            defaultValue={payload.availableTo}
          />
        </FieldRow>
        <TextField
          id="f-link"
          label="Lien"
          defaultValue={payload.link}
          placeholder="https://..."
          onPaste={() => {
            window.importHomeExchangePaste();
            window.importAirbnbPaste();
          }}
          onChange={() => {
            window.importHomeExchangeLink();
            window.importAirbnbLink();
          }}
        />
        <TextField
          id="f-booking-link"
          label="Lien Booking"
          defaultValue={payload.bookingLink}
          placeholder="https://..."
          onPaste={() => window.importBookingPaste()}
          onChange={() => window.importBookingLink()}
        />
        <TextField
          id="f-maps-link"
          label="Lien Google Maps"
          defaultValue={payload.mapsLink}
          placeholder="https://..."
          onPaste={(event) => window.importGoogleMapsPaste(event.currentTarget, 'f-name')}
          onChange={(event) => window.importGoogleMapsLink(event.currentTarget, 'f-name')}
        />
        <label className="filter-option" style={{ padding: '0 0 6px 0' }}>
          <input type="checkbox" id="f-favorite" defaultChecked={payload.favorite} />
          <Icon name="star" fill /> Coup de cœur
        </label>
      </div>
      <div className="modal-actions">
        <CloseModalButton />
        <ModalSaveButton onClick={() => window.saveAccommodation(payload.id || '')} />
      </div>
    </>
  );
}
