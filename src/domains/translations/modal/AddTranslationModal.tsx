import { SelectField } from '@/shared/form-fields/SelectField';
import { TextField } from '@/shared/form-fields/TextField';
import { TextareaField } from '@/shared/form-fields/TextareaField';
import { CloseModalButton } from '@/shared/modal/CloseModalButton';
import { ModalSaveButton } from '@/shared/modal/ModalSaveButton';
import { ModalTitle } from '@/shared/modal/ModalTitle';
import type { CustomPhrase } from '../types';

// Port de phraseForm/saveCustomPhrase (js/views/phrases.js) — #f-save délègue à
// window.saveCustomPhrase(id) inchangée, qui lit ces mêmes ids via readCustomPhraseForm.
export function AddTranslationModal({ payload }: { payload: CustomPhrase }) {
  const categoryOptions = window.PHRASE_CATEGORIES.map((category) => ({
    value: category.title,
    label: category.title,
  }));

  return (
    <>
      <ModalTitle isNew={!payload.id} subject="une phrase" />
      <SelectField
        id="translation-category"
        label="Catégorie"
        defaultValue={payload.category}
        placeholder="Sans catégorie — à ranger plus tard"
        options={categoryOptions}
      />
      <TextareaField
        id="translation-fr-input"
        label="Phrase (français)"
        defaultValue={payload.fr}
      />
      <TextField id="translation-note-input" label="Note (optionnel)" defaultValue={payload.note} />
      <div className="modal-actions">
        <CloseModalButton />
        <ModalSaveButton onClick={() => window.saveCustomPhrase(payload.id || '')} />
      </div>
    </>
  );
}
