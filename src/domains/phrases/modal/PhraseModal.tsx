import { CloseModalButton } from '../../../shared/CloseModalButton';
import { ModalSaveButton } from '../../../shared/ModalSaveButton';
import { ModalTitle } from '../../../shared/ModalTitle';
import { SelectField } from '../../../shared/SelectField';
import { TextField } from '../../../shared/TextField';
import { TextareaField } from '../../../shared/TextareaField';
import type { CustomPhrase } from '../types';

// Port de phraseForm/saveCustomPhrase (js/views/phrases.js) — #f-save délègue à
// window.saveCustomPhrase(id) inchangée, qui lit ces mêmes ids via readCustomPhraseForm.
export function PhraseModal({ payload }: { payload: CustomPhrase }) {
  const categoryOptions = window.PHRASE_CATEGORIES.map((category) => ({
    value: category.title,
    label: category.title,
  }));

  return (
    <>
      <ModalTitle isNew={!payload.id} subject="une phrase" />
      <SelectField
        id="phrase-category"
        label="Catégorie"
        defaultValue={payload.category}
        placeholder="Sans catégorie — à ranger plus tard"
        options={categoryOptions}
      />
      <TextareaField id="phrase-fr-input" label="Phrase (français)" defaultValue={payload.fr} />
      <TextField id="phrase-note-input" label="Note (optionnel)" defaultValue={payload.note} />
      <div className="modal-actions">
        <CloseModalButton />
        <ModalSaveButton onClick={() => window.saveCustomPhrase(payload.id || '')} />
      </div>
    </>
  );
}
