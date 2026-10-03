import type { Scenario } from '../../../store/types';

export function AddBudgetButton({ scenario }: { scenario: Scenario | null }) {
  return (
    <button
      type="button"
      className="toolbar-btn"
      onClick={() =>
        scenario ? window.openModal('charge', '', scenario.id) : window.openModal('charge')
      }
    >
      Ajouter au budget
    </button>
  );
}
