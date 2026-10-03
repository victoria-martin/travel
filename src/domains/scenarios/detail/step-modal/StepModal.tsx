import { LegacyMarkup } from '@/shared/LegacyMarkup';
import { TextField } from '@/shared/form-fields/TextField';
import { TextareaField } from '@/shared/form-fields/TextareaField';
import { FieldRow } from '@/shared/layout/FieldRow';
import { CloseModalButton } from '@/shared/modal/CloseModalButton';
import { ModalSaveButton } from '@/shared/modal/ModalSaveButton';
import { ModalTitle } from '@/shared/modal/ModalTitle';
import type { Step } from '@/store/types';

/*
  Port de stepForm/saveStep (js/views/scenarios/detail/step-modal/{form,save}.js), délègue à
  window.saveStep(id) inchangée. Le champ Activités (stepAttractionsField,
  js/.../attractions-field.js) reste en LegacyMarkup : recherche avec navigation clavier, survol,
  création à la volée, état de rang retenu dans une globale module (activeAttractionResult) — un
  sous-système stateful qui vit déjà très bien en legacy, pas assez de valeur à le réimplémenter
  tout de suite (plan § briques partagées). `radio-card-field` n'intervient pas ici (il sert
  trail-options/weather, pas cette modale) : la note du plan le mentionnant était obsolète.
*/
export function StepModal({ payload }: { payload: Step }) {
  return (
    <>
      <ModalTitle isNew={!payload.id} subject="une étape" />
      <TextField id="s-name" label="Nom" defaultValue={payload.name} />
      <FieldRow>
        <div className="field">
          <label htmlFor="s-nights">Nuits</label>
          <input id="s-nights" type="number" min={0} defaultValue={window.stepNights(payload)} />
        </div>
        <TextField
          id="s-budget"
          label="Budget"
          defaultValue={payload.budget}
          placeholder="Remplace le prix de l'hébergement"
        />
      </FieldRow>
      <TextField id="s-date" label="Date d'arrivée" defaultValue={payload.arrivalDate} hint="ex. 12 juin" />
      <LegacyMarkup html={window.stepAttractionsField(payload)} />
      <TextareaField id="s-notes" label="Notes" rows={2} defaultValue={payload.notes} />
      <div className="modal-actions">
        <CloseModalButton />
        <ModalSaveButton onClick={() => window.saveStep(payload.id || '')} />
      </div>
    </>
  );
}
