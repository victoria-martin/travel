import { LegacyMarkup } from '@/shared/LegacyMarkup';
import { SelectField } from '@/shared/form-fields/SelectField';
import { TextField } from '@/shared/form-fields/TextField';
import { TextareaField } from '@/shared/form-fields/TextareaField';
import { FieldRow } from '@/shared/layout/FieldRow';
import { CloseModalButton } from '@/shared/modal/CloseModalButton';
import { ModalSaveButton } from '@/shared/modal/ModalSaveButton';
import type { Travel } from '@/store/types';

/*
  Port de travelForm/saveTravel (js/views/travels/modal/{form,save}.js), délègue à
  window.saveTravel(id) inchangée. `MODAL_TYPES.voyage.after` (paintTravelModal) reste tel quel
  dans modal.js : ModalHost rappelle déjà `cfg.after` après toute peinture, React comprise, pas
  besoin d'un useEffect ici. Emoji picker, sous-titre dérivé (pays/région) et nuancier d'accent
  restent en LegacyMarkup : trois sous-systèmes stateful qui ne touchent jamais modal.payload (ils
  lisent/écrivent leurs propres champs par id, lus par saveTravel au clic) ; `travelCountriesField`
  pareil, mais mute modal.payload.countries comme tagsField.

  `#travel-fuel-price`/`#travel-toll-rate` sont restaurés ici : `readTravelForm` (save.js) les lit
  sans condition, mais le formulaire legacy ne les rendait plus depuis `2c02b9d` (19/09) — Enregistrer
  plantait sur ces deux champs absents à chaque sauvegarde de voyage. Fix fait au passage.
*/
export function TravelModal({ payload }: { payload: Travel }) {
  const statusOptions = Object.entries(window.TRAVEL_STATUSES).map(([key, status]) => ({
    value: key,
    label: `${status.emoji} ${status.label}`,
  }));

  return (
    <>
      <div className="travel-modal-header">
        <LegacyMarkup html={window.travelEmojiPicker(payload)} />
        <div>
          <h3>
            <span
              className="editable"
              id="travel-name"
              contentEditable
              suppressContentEditableWarning
              data-placeholder="Nouveau voyage"
              onKeyDown={(event) => window.commitOnEnter(event.nativeEvent)}
            >
              {payload.name}
            </span>
          </h3>
          <LegacyMarkup html={window.travelHeaderPlace(payload)} />
        </div>
      </div>
      <FieldRow>
        <LegacyMarkup html={window.travelCountriesField(payload)} />
        <TextField id="travel-region" label="Région" defaultValue={payload.region} />
      </FieldRow>
      <FieldRow>
        <TextField id="travel-start" label="Début" type="date" defaultValue={payload.startDate} />
        <TextField id="travel-end" label="Fin" type="date" defaultValue={payload.endDate} />
      </FieldRow>
      <FieldRow>
        <SelectField
          id="travel-status"
          label="Statut"
          defaultValue={payload.status || window.DEFAULT_TRAVEL_STATUS}
          options={statusOptions}
        />
        <div className="field">
          <label htmlFor="travel-travelers">Voyageurs</label>
          <input id="travel-travelers" type="number" min={0} defaultValue={payload.travelers || 0} />
        </div>
      </FieldRow>
      <LegacyMarkup html={window.travelAccentSwatches(payload)} />
      <FieldRow>
        <TextField
          id="travel-fuel-price"
          label="Prix du litre"
          defaultValue={payload.fuelPrice}
          placeholder={`${window.formatRate(window.DEFAULT_FUEL_PRICE)} €`}
        />
        <TextField
          id="travel-toll-rate"
          label="Péage au km"
          defaultValue={payload.tollRate}
          placeholder={`${window.formatRate(window.DEFAULT_TOLL_RATE)} €`}
        />
      </FieldRow>
      <TextField
        id="travel-image"
        label="Image"
        defaultValue={payload.image}
        placeholder="https://…"
      />
      <TextareaField
        id="travel-description"
        label="Description"
        rows={2}
        defaultValue={payload.description}
      />
      <div className="modal-actions">
        <CloseModalButton />
        <ModalSaveButton onClick={() => window.saveTravel(payload.id || '')} />
      </div>
    </>
  );
}
