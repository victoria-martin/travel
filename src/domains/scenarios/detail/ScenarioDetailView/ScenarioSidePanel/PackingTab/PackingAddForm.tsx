import { TextField } from '@/shared/form-fields/TextField';
import { useState } from 'react';

// Inline rather than a modal, to stay in the narrow side panel column.
export function PackingAddForm({ onClose }: { onClose: () => void }) {
  const [label, setLabel] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [alsoInCatalog, setAlsoInCatalog] = useState(false);

  const add = () => {
    if (!label.trim()) return;
    window.addTravelPackingItem({
      label: label.trim(),
      category: category.trim(),
      quantity: parseInt(quantity) || 0,
      alsoInCatalog,
    });
    onClose();
  };

  return (
    <div className="add-item-form">
      <TextField
        id="packing-add-label"
        label="Libellé"
        onChange={(event) => setLabel(event.target.value)}
      />
      <div className="add-item-form-row">
        <TextField
          id="packing-add-category"
          label="Catégorie"
          listOptions={window.allPackingCategories()}
          onChange={(event) => setCategory(event.target.value)}
        />
        <div className="field packing-add-qty">
          <label htmlFor="packing-add-quantity">Qté</label>
          <input
            id="packing-add-quantity"
            type="number"
            min={0}
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
          />
        </div>
      </div>
      <label className="filter-option" style={{ padding: '0 0 6px 0' }}>
        <input
          type="checkbox"
          checked={alsoInCatalog}
          onChange={(event) => setAlsoInCatalog(event.target.checked)}
        />
        Ajouter aussi au catalogue
      </label>
      <div className="modal-actions">
        <button type="button" className="btn btn-outline" onClick={onClose}>
          Annuler
        </button>
        <button type="button" className="btn" onClick={add}>
          Ajouter
        </button>
      </div>
    </div>
  );
}
