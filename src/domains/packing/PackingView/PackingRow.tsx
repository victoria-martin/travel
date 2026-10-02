import { EditableTextCell } from '../../../shared/cells/EditableTextCell';
import { Icon } from '../../../shared/Icon';
import type { PackingItem } from '../../../store/types';

// Port de packingCatalogRow (js/views/packing/catalog-list.js).
export function PackingRow({ item }: { item: PackingItem }) {
  return (
    <div className="packing-row">
      <span className="packing-row-label">{item.label}</span>
      <span className="packing-row-notes">
        <EditableTextCell
          value={item.notes}
          placeholder="Notes…"
          onSave={(notes) => {
            item.notes = notes;
            window.saveNow();
          }}
        />
      </span>
      <span className="packing-row-actions">
        <button
          type="button"
          className="icon-btn"
          title="Modifier"
          onClick={() => window.openModal('valise-catalogue', item.id)}
        >
          <Icon name="pencil" />
        </button>
        <button
          type="button"
          className="icon-btn"
          title="Supprimer"
          onClick={() => window.deletePackingItem(item.id)}
        >
          <Icon name="trash-2" />
        </button>
      </span>
    </div>
  );
}
