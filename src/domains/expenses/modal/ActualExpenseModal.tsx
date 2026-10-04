import { SelectField } from '@/shared/form-fields/SelectField';
import { TextField } from '@/shared/form-fields/TextField';
import { TextareaField } from '@/shared/form-fields/TextareaField';
import { FieldRow } from '@/shared/layout/FieldRow';
import { CloseModalButton } from '@/shared/modal/CloseModalButton';
import { ModalSaveButton } from '@/shared/modal/ModalSaveButton';
import { ModalTitle } from '@/shared/modal/ModalTitle';
import type { ActualExpense } from '@/store/types';

/*
  Premier formulaire de modale porté en React (pilote, docs/en-cours/react-migration-plan.md § 4) — reste
  volontairement proche du legacy : champs non contrôlés (defaultValue, comme EditableTextCell
  ailleurs), bouton #f-save gardé (submitModal()/Entrée le cliquent programmatiquement, voir
  modal.js) qui délègue à window.saveActualExpense(id), inchangée — elle lit déjà ces mêmes ids
  via document.getElementById, aucune raison de dupliquer cette logique ici. Le gabarit est
  composé de champs génériques (shared/TextField, SelectField…) plutôt que du balisage `.field`
  répété à la main.
*/
export function ActualExpenseModal({ payload }: { payload: ActualExpense }) {
  const scenario = window.expenseBudgetScenario();
  const scenarioCostIds = new Set(scenario?.costIds || []);
  const allCosts = window.manualExpenses();
  const budgetCosts = allCosts.filter((cost) => scenarioCostIds.has(cost.id));
  const linkedCost = allCosts.find((cost) => cost.id === payload.fixedCostId);
  if (linkedCost && !budgetCosts.some((cost) => cost.id === linkedCost.id)) {
    budgetCosts.push(linkedCost);
  }
  const budgetOptions = budgetCosts.map((cost) => ({
    value: cost.id,
    label: cost.label || 'Sans libellé',
  }));

  return (
    <>
      <ModalTitle isNew={!payload.id} subject="une dépense réelle" />
      <TextField
        id="actual-expense-date"
        label="Date"
        type="date"
        defaultValue={payload.date}
        required
      />
      <TextField id="actual-expense-label" label="Dépense" defaultValue={payload.label} required />
      <TextField
        id="actual-expense-amount"
        label="Montant"
        defaultValue={payload.amount}
        required
      />
      <SelectField
        id="actual-expense-budget"
        label="Poste budgétaire"
        defaultValue={payload.fixedCostId}
        placeholder="Non budgétisé"
        options={budgetOptions}
      />
      <FieldRow>
        <TextField id="actual-expense-category" label="Catégorie" defaultValue={payload.category} />
        <TextField
          id="actual-expense-sub-category"
          label="Sous-catégorie"
          defaultValue={payload.subCategory}
        />
      </FieldRow>
      <TextField id="actual-expense-address" label="Adresse" defaultValue={payload.address} />
      <TextareaField id="actual-expense-notes" label="Notes" defaultValue={payload.notes} />
      <div className="modal-actions">
        <CloseModalButton />
        <ModalSaveButton onClick={() => window.saveActualExpense(payload.id || '')} />
      </div>
    </>
  );
}
