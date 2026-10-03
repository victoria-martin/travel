import type { Scenario } from '@/store/types';

export function AddBudgetButton({ scenario }: { scenario: Scenario | null }) {
  return (
    <>
      {/* TODO; Button à créer */}
      {/* <Button
    title="Ajouter au budget"
      onClick={() =>
        scenario ? window.openModal('charge', '', scenario.id) : window.openModal('charge')
      }
      >Ajouter au budget</Button> */}
      <button
        type="button"
        className="toolbar-btn"
        onClick={() =>
          scenario ? window.openModal('charge', '', scenario.id) : window.openModal('charge')
        }
      >
        Ajouter au budget
      </button>
    </>
  );
}
