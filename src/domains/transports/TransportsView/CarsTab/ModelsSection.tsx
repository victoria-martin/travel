import { useState } from 'react';
import { DataTable } from '../../../../shared/DataTable/DataTable';
import { Icon } from '../../../../shared/Icon';
import { normalizeSearch } from '../../../../shared/normalizeSearch';
import { SearchField } from '../../../../shared/SearchField';
import { ColumnPicker } from '../../../../shared/toolbar/ColumnPicker';
import type { CarModel } from '../../../../store/types';
import { useTravelStore } from '../../../../store/useTravelStore';
import { columns } from './ModelsSection/columns';

function carModelSearchText(model: CarModel): string {
  return [model.name, window.carFuel(model.fuel).label, window.carGearbox(model.gearbox).label].join(
    ' ',
  );
}

export function ModelsSection() {
  const models = useTravelStore((store) => window.ofCurrentTravel(store.data.carModels));
  const [query, setQuery] = useState('');
  const wanted = normalizeSearch(query);
  const items = models
    .filter((model) => !wanted || normalizeSearch(carModelSearchText(model)).includes(wanted))
    .sort((modelA, modelB) => modelA.name.localeCompare(modelB.name, 'fr'));
  const hidden = window.hiddenColumns('modeles');
  const visibleColumns = columns.filter((column) => column.locked || !hidden.includes(column.key));

  return (
    <section className="list-section">
      <div className="list-section-head">
        <h3 className="list-section-title">Modèles</h3>
        <div className="list-section-actions">
          <SearchField value={query} onChange={setQuery} />
          <ColumnPicker kind="modeles" columns={columns} />
          <button
            type="button"
            className="toolbar-btn"
            title="Ajouter un modèle"
            onClick={() => window.openModal('modele')}
          >
            <span className="toolbar-icon">
              <Icon name="plus" />
            </span>
            <span className="toolbar-label">Modèle</span>
          </button>
        </div>
      </div>
      {items.length ? (
        <DataTable columns={visibleColumns} items={items} />
      ) : (
        <div className="empty-state">
          <strong>Aucun modèle</strong>
          Ajoute un modèle, ou tape-le en relevant une offre : il rejoint le catalogue.
        </div>
      )}
    </section>
  );
}
