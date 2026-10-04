import { groupPackingByCategory } from '@/domains/packing/group';
import { Button } from '@/shared/buttons/Button';
import { ToolbarFace } from '@/shared/toolbar/ToolbarFace';
import { useTravelStore } from '@/store/useTravelStore';
import { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { PackingAddForm } from './PackingTab/PackingAddForm';
import { PackingLineGroup } from './PackingTab/PackingLineGroup';

// The trip's luggage, not the scenario's: the only place to add an item specific to this trip.
export function PackingTab() {
  const items = useTravelStore(
    useShallow((store) => window.ofCurrentTravel(store.data.packingListItems)),
  );
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const done = items.filter((item) => item.checked).length;
  const percent = items.length ? Math.round((done / items.length) * 100) : 0;

  return (
    <div className="scenario-extra scenario-extra-packing">
      <div className="scenario-extra-head">
        <div className="acc-recap-title">Valise</div>
      </div>
      {items.length > 0 && (
        <div className="packing-progress-row">
          <div className="packing-progress-track">
            <div className="packing-progress-fill" style={{ width: `${percent}%` }} />
          </div>
          <span className="packing-progress-label">
            {done} / {items.length} emballés
          </span>
        </div>
      )}
      <div className="scenario-extra-actions">
        <Button
          size="small"
          title="item"
          ariaLabel="item"
          onClick={() => setIsAddFormOpen((isOpen) => !isOpen)}
        >
          <ToolbarFace icon="plus" label="item" />
        </Button>
      </div>
      {isAddFormOpen && <PackingAddForm onClose={() => setIsAddFormOpen(false)} />}
      {items.length === 0 ? (
        <div className="scenario-extra-empty">
          Aucun item — compose la valise depuis la page Valise, ou ajoute un item propre à ce
          voyage.
        </div>
      ) : (
        groupPackingByCategory(items, (item) => window.packingLineCategory(item)).map((group) => (
          <PackingLineGroup key={group.category} group={group} />
        ))
      )}
    </div>
  );
}
