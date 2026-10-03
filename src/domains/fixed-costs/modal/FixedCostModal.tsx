import { SelectField } from '@/shared/form-fields/SelectField';
import { TagsField } from '@/shared/form-fields/TagsField';
import { TextField } from '@/shared/form-fields/TextField';
import { TextareaField } from '@/shared/form-fields/TextareaField';
import { CloseModalButton } from '@/shared/modal/CloseModalButton';
import { ModalSaveButton } from '@/shared/modal/ModalSaveButton';
import { ModalTitle } from '@/shared/modal/ModalTitle';
import type { FixedCost } from '@/store/types';
import { useState } from 'react';

/*
  Port de fixedCostForm/saveFixedCost (js/views/fixed-costs/modal/{form,save}.js) — mêmes principes
  que ActualExpenseModal : champs non contrôlés, #f-save délègue à window.saveFixedCost(id)
  inchangée. Seul `categories` est contrôlé (TagsField) : ajouter/retirer un tag doit se voir tout
  de suite, un `defaultValue` ne suffit pas pour une liste. `payload.categories` reste mutée en
  parallèle du state local pour que saveFixedCost (qui la lit directement sur modal.payload) voie
  la bonne valeur.
*/
export function FixedCostModal({ payload }: { payload: FixedCost }) {
  const [categories, setCategories] = useState(payload.categories);

  function handleCategoriesChange(next: string[]) {
    setCategories(next);
    payload.categories = next;
  }

  const recurrenceOptions = Object.entries(window.EXPENSE_RECURRENCES).map(([key, recurrence]) => ({
    value: key,
    label: `${recurrence.emoji} ${recurrence.label}`,
  }));

  return (
    <>
      <ModalTitle isNew={!payload.id} subject="une charge budgétaire" />
      <TextField id="cost-label" label="Libellé" defaultValue={payload.label} />
      <TextField id="cost-amount" label="Montant" defaultValue={payload.amount} />
      <TagsField
        label="Catégories"
        tags={categories}
        vocabulary={window.allFixedCostCategories()}
        onChange={handleCategoriesChange}
      />
      <SelectField
        id="cost-recurrence"
        label="Récurrence"
        defaultValue={window.expenseRecurrenceKey(payload.recurrence)}
        options={recurrenceOptions}
      />
      <TextareaField id="cost-notes" label="Notes" defaultValue={payload.notes} />
      <div className="modal-actions">
        <CloseModalButton />
        <ModalSaveButton onClick={() => window.saveFixedCost(payload.id || '')} />
      </div>
    </>
  );
}
