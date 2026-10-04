import { groupPackingByCategory } from '@/domains/packing/group';
import { useTravelStore } from '@/store/useTravelStore';
import { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { ComposerGroup } from './PackingComposerModal/ComposerGroup';

// Ticking a catalog item adds it to the open trip's luggage, unticking removes it; the catalog itself never changes here.
export function PackingComposerModal() {
  const catalog = useTravelStore((store) => store.data.packingItems);
  const travelLines = useTravelStore(
    useShallow((store) => window.ofCurrentTravel(store.data.packingListItems)),
  );
  const [query, setQuery] = useState('');
  const travel = window.currentTravel();
  const travelCatalogIds = new Set(
    travelLines.flatMap((line) => (line.packingItemId ? [line.packingItemId] : [])),
  );
  const needle = query.trim().toLowerCase();
  const items = [...catalog]
    .sort((itemA, itemB) => (itemA.label || '').localeCompare(itemB.label || '', 'fr'))
    .filter((item) => !needle || item.label.toLowerCase().includes(needle));

  return (
    <>
      <h3>Composer la valise</h3>
      <p className="view-sub" style={{ margin: '-10px 0 14px' }}>
        {travel?.name || ''}
      </p>
      <input
        className="filter-search"
        type="text"
        placeholder="Rechercher dans le catalogue…"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <div className="packing-list">
        {items.length === 0 ? (
          <div className="empty-state">
            <strong>Catalogue vide</strong>
            Ajoute d&apos;abord un item au catalogue.
          </div>
        ) : (
          groupPackingByCategory(items, (item) => item.category).map((group) => (
            <ComposerGroup key={group.category} group={group} travelCatalogIds={travelCatalogIds} />
          ))
        )}
      </div>
      <div className="modal-actions modal-actions-split">
        <p className="view-sub" style={{ margin: 0 }}>
          <strong>{travelCatalogIds.size}</strong> sur {catalog.length} items du catalogue ajoutés à
          cette valise
        </p>
        <button type="button" className="btn" onClick={() => window.closeModal()}>
          Terminé
        </button>
      </div>
    </>
  );
}
