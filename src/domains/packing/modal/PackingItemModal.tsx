import { TextField } from '@/shared/form-fields/TextField';
import { TextareaField } from '@/shared/form-fields/TextareaField';
import { CloseModalButton } from '@/shared/modal/CloseModalButton';
import { ModalSaveButton } from '@/shared/modal/ModalSaveButton';
import { ModalTitle } from '@/shared/modal/ModalTitle';
import type { PackingItem } from '@/store/types';

// Port de packingCatalogForm/savePackingItem (js/views/packing/modal/catalog-{form,save}.js) —
// #f-save délègue à window.savePackingItem(id) inchangée.
export function PackingItemModal({ payload }: { payload: PackingItem }) {
  return (
    <>
      <ModalTitle isNew={!payload.id} subject="un item du catalogue" />
      <TextField id="packing-item-label" label="Libellé" defaultValue={payload.label} />
      <TextField
        id="packing-item-category"
        label="Catégorie"
        defaultValue={payload.category}
        listOptions={window.allPackingCategories()}
      />
      <TextareaField id="packing-item-notes" label="Notes" defaultValue={payload.notes} />
      <div className="modal-actions">
        <CloseModalButton />
        <ModalSaveButton onClick={() => window.savePackingItem(payload.id || '')} />
      </div>
    </>
  );
}
