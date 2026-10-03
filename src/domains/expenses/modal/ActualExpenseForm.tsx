import { CloseModalButton } from '../../../shared/CloseModalButton';
import type { ActualExpense } from '../../../store/types';

/*
  Premier formulaire de modale porté en React (pilote, docs/react-migration-plan.md § 4) — reste
  volontairement proche du legacy : champs non contrôlés (defaultValue, comme EditableTextCell
  ailleurs), bouton #f-save gardé (submitModal()/Entrée le cliquent programmatiquement, voir
  modal.js) qui délègue à window.saveActualExpense(id), inchangée — elle lit déjà ces mêmes ids
  via document.getElementById, aucune raison de dupliquer cette logique ici. Seul le gabarit
  change : JSX typé à la place d'une chaîne HTML échappée à la main.
*/
export function ActualExpenseForm({ payload }: { payload: ActualExpense }) {
  const scenario = window.expenseBudgetScenario();
  const scenarioCostIds = new Set(scenario?.costIds || []);
  const allCosts = window.manualExpenses();
  const budgetCosts = allCosts.filter((cost) => scenarioCostIds.has(cost.id));
  const linkedCost = allCosts.find((cost) => cost.id === payload.fixedCostId);
  if (linkedCost && !budgetCosts.some((cost) => cost.id === linkedCost.id)) {
    budgetCosts.push(linkedCost);
  }

  return (
    <>
      <h3>{payload.id ? 'Modifier' : 'Ajouter'} une dépense réelle</h3>
      <div className="field">
        <label htmlFor="actual-expense-date">Date</label>
        <input id="actual-expense-date" type="date" defaultValue={payload.date} required />
      </div>
      <div className="field">
        <label htmlFor="actual-expense-label">Dépense</label>
        <input id="actual-expense-label" type="text" defaultValue={payload.label} required />
      </div>
      <div className="field">
        <label htmlFor="actual-expense-amount">Montant</label>
        <input id="actual-expense-amount" type="text" defaultValue={payload.amount} required />
      </div>
      <div className="field">
        <label htmlFor="actual-expense-budget">Poste budgétaire</label>
        <select id="actual-expense-budget" defaultValue={payload.fixedCostId}>
          <option value="">Non budgétisé</option>
          {budgetCosts.map((cost) => (
            <option key={cost.id} value={cost.id}>
              {cost.label || 'Sans libellé'}
            </option>
          ))}
        </select>
      </div>
      <div className="field-row">
        <div className="field">
          <label htmlFor="actual-expense-category">Catégorie</label>
          <input id="actual-expense-category" type="text" defaultValue={payload.category} />
        </div>
        <div className="field">
          <label htmlFor="actual-expense-sub-category">Sous-catégorie</label>
          <input
            id="actual-expense-sub-category"
            type="text"
            defaultValue={payload.subCategory}
          />
        </div>
      </div>
      <div className="field">
        <label htmlFor="actual-expense-address">Adresse</label>
        <input id="actual-expense-address" type="text" defaultValue={payload.address} />
      </div>
      <div className="field">
        <label htmlFor="actual-expense-notes">Notes</label>
        <textarea id="actual-expense-notes" rows={2} defaultValue={payload.notes} />
      </div>
      <div className="modal-actions">
        <CloseModalButton />
        <button
          type="button"
          className="btn"
          id="f-save"
          onClick={() => window.saveActualExpense(payload.id || '')}
        >
          Enregistrer
        </button>
      </div>
    </>
  );
}
