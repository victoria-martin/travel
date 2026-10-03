import { normalizeSearch } from '@/shared/normalizeSearch';
import { SearchInput } from '@/shared/SearchInput';
import { ColumnPicker } from '@/shared/toolbar/ColumnPicker';
import type { CarModel } from '@/store/types';
import { useTravelStore } from '@/store/useTravelStore';
import { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { AddCarModelButton } from './CarModelsSection/AddCarModelButton';
import { CarModelsTable } from './CarModelsSection/CarModelsTable';
import { columns } from './CarModelsSection/columns';

function carModelSearchText(model: CarModel): string {
  return [
    model.name,
    window.carFuel(model.fuel).label,
    window.carGearbox(model.gearbox).label,
  ].join(' ');
}

// INFO: ce composant est tres bien decoupé, il faut en faire un exemple pour les futures implem (decoupage avec table, bouton pour Add, imports avec "@" etc.)
export function CarModelsSection() {
  const models = useTravelStore(
    useShallow((store) => window.ofCurrentTravel(store.data.carModels)),
  );
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
          <SearchInput value={query} onChange={setQuery} />
          <ColumnPicker kind="modeles" columns={columns} />
          <AddCarModelButton />
        </div>
      </div>
      <CarModelsTable columns={visibleColumns} items={items} />
    </section>
  );
}
