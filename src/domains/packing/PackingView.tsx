import { Icon } from '@/shared/Icon';
import { useTravelStore } from '@/store/useTravelStore';
import { useState } from 'react';
import { groupPackingByCategory, UNCATEGORIZED } from './group';
import { PackingGroup } from './PackingView/PackingGroup';

/*
  Porte js/views/packing/{packing,page-header,catalog-toolbar,catalog-list}.js : le catalogue
  (personnel, pas filtré par voyage — state.packingItems n'a pas de travelId). Composer la valise
  du voyage (openSheet('valise-composer')) et l'onglet Valise d'un scénario restent legacy, pas
  concernés par ce port. Recherche et filtre de catégorie en `useState` React (contrôlés) : la
  liste qui se filtre n'est pas le champ qui tape, pas de perte de focus à craindre.
*/
export function PackingView() {
  const items = useTravelStore((store) => store.data.packingItems);
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const categories = Array.from(new Set(items.map((item) => item.category || UNCATEGORIZED))).sort(
    (a, b) => a.localeCompare(b, 'fr'),
  );

  const needle = query.trim().toLowerCase();
  const filtered = [...items]
    .sort((a, b) => (a.label || '').localeCompare(b.label || '', 'fr'))
    .filter((item) => {
      if (categoryFilter && (item.category || UNCATEGORIZED) !== categoryFilter) return false;
      return (
        !needle ||
        [item.label, item.category || ''].some((value) => value.toLowerCase().includes(needle))
      );
    });
  const groups = groupPackingByCategory(filtered);

  return (
    <>
      <div className="view-header">
        <div>
          <h2 className="view-title">Valise</h2>
          <p className="view-sub">
            {items.length} item{items.length > 1 ? 's' : ''} au catalogue · {categories.length}{' '}
            catégorie{categories.length > 1 ? 's' : ''}
          </p>
        </div>
      </div>
      <div className="packing-toolbar">
        <input
          className="filter-search"
          style={{ width: 220, marginBottom: 0 }}
          type="text"
          placeholder="Rechercher un item…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <div className="filter-pills">
          <button
            type="button"
            className={`filter-pill ${categoryFilter ? '' : 'active'}`}
            onClick={() => setCategoryFilter(null)}
          >
            Toutes
          </button>
          {categories.map((category) => (
            <button
              type="button"
              key={category}
              className={`filter-pill ${categoryFilter === category ? 'active' : ''}`}
              onClick={() => setCategoryFilter(category)}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="packing-toolbar-spacer" />
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => window.openModal('valise-catalogue')}
        >
          <Icon name="plus" /> Nouvel item
        </button>
        <button type="button" className="btn" onClick={() => window.openSheet('valise-composer')}>
          <Icon name="luggage" /> Composer la valise
        </button>
      </div>
      <div className="packing-list">
        {groups.length === 0 ? (
          <div className="empty-state">
            <strong>Catalogue vide</strong>
            Ajoute ce que tu emportes en général — un item à la fois.
          </div>
        ) : (
          groups.map((group) => <PackingGroup key={group.category} group={group} />)
        )}
      </div>
    </>
  );
}
