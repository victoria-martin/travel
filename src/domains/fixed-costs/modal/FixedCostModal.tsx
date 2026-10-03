import { useState } from 'react';
import { CloseModalButton } from '../../../shared/CloseModalButton';
import { TagsField } from '../../../shared/TagsField';
import type { FixedCost } from '../../../store/types';

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

  return (
    <>
      <h3>{payload.id ? 'Modifier' : 'Ajouter'} une charge budgétaire</h3>
      <div className="field">
        <label htmlFor="cost-label">Libellé</label>
        <input id="cost-label" type="text" defaultValue={payload.label} />
      </div>
      <div className="field">
        <label htmlFor="cost-amount">Montant</label>
        <input id="cost-amount" type="text" defaultValue={payload.amount} />
      </div>
      <TagsField
        label="Catégories"
        tags={categories}
        vocabulary={window.allFixedCostCategories()}
        onChange={handleCategoriesChange}
      />
      <div className="field">
        <label htmlFor="cost-recurrence">Récurrence</label>
        <select id="cost-recurrence" defaultValue={window.expenseRecurrenceKey(payload.recurrence)}>
          {Object.entries(window.EXPENSE_RECURRENCES).map(([key, recurrence]) => (
            <option key={key} value={key}>
              {recurrence.emoji} {recurrence.label}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="cost-notes">Notes</label>
        <textarea id="cost-notes" rows={2} defaultValue={payload.notes} />
      </div>
      <div className="modal-actions">
        <CloseModalButton />
        <button
          type="button"
          className="btn"
          id="f-save"
          onClick={() => window.saveFixedCost(payload.id || '')}
        >
          Enregistrer
        </button>
      </div>
    </>
  );
}
