import { LegacyMarkup } from '@/shared/LegacyMarkup';
import { CloseModalButton } from '@/shared/modal/CloseModalButton';
import { ModalSaveButton } from '@/shared/modal/ModalSaveButton';

/*
  Port de pasteImportForm/runPasteImport (js/views/accommodations/modal/paste-import.js) — pas de
  payload à ce type (MODAL_TYPES.open renvoie `{ text: '' }`, jamais lu). Les instructions +
  textarea + aperçu restent en LegacyMarkup (pasteImportInstructions, extrait de l'ancien
  pasteImportForm) : texte informatif dérivé de constantes legacy (IMPORT_FIELDS,
  PASTE_COLUMN_ORDER…), pas de valeur à le recomposer en JSX. `runPasteImport` lit #paste-area et
  fait tout elle-même (import, toast, fermeture) — pas un simple save délégué, mais le bouton
  #f-save garde le même rôle.
*/
export function PasteImportModal() {
  return (
    <>
      <h3>Importer depuis un tableau</h3>
      <LegacyMarkup html={window.pasteImportInstructions()} />
      <div className="modal-actions">
        <CloseModalButton />
        <ModalSaveButton onClick={() => window.runPasteImport()} />
      </div>
    </>
  );
}
