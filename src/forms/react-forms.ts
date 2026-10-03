import { ActualExpenseForm } from '../domains/expenses/modal/ActualExpenseForm';
import { ImportExpensesForm } from '../domains/expenses/modal/ImportExpensesForm';
import { FixedCostForm } from '../domains/fixed-costs/modal/FixedCostForm';

/*
  REACT_FORMS porte les types migrés en vrai composant React (pilote : actual-expense) — le reste
  de la mécanique (MODAL_TYPES.open/edits, dirty-check, dismissModal, Entrée/Échap) ne change pas :
  modalFieldsState() (modal.js) lit le DOM générique (input/textarea/select sous .modal), qui
  existe pareil que la forme soit peinte en chaîne ou par un composant.
*/
export const REACT_FORMS: Record<string, (props: { payload: any }) => React.JSX.Element> = {
  'actual-expense': ActualExpenseForm,
  'import-expenses': ImportExpensesForm,
  charge: FixedCostForm,
};
