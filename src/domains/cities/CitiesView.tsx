import { useState } from 'react';
import { DataTable } from '../../shared/DataTable/DataTable';
import type { Column } from '../../shared/DataTable/types';
import { SearchField } from '../../shared/SearchField';
import { normalizeSearch } from '../../shared/normalizeSearch';
import { ColumnPicker } from '../../shared/toolbar/ColumnPicker';
import { TextCell } from '../../shared/cells/TextCell';
import { TagsCell } from '../../shared/cells/TagsCell';
import type { Attraction } from '../../store/types';
import { useTravelStore } from '../../store/useTravelStore';
import { FavoriteCell, NameCell, StatusBadge, TypeBadge } from './cells';

/*
  Porte js/views/villes/cities.js + columns.js sur DataTable. `hiddenColumns`/`toggleColumn`
  délégués au legacy (js/columns.js) : COLUMN_SETS.cities reste chargé et porte déjà
  `description: {hiddenByDefault: true}`, une seule source pour la préférence. Clé 'cities' choisie
  pour la route/le code — le libellé visible reste « Villes » (NAV_ITEMS, ce fichier).
  Pas encore portés : menu ⋮, tags éditables, actions de ligne ; tri sur ville/nom/favori
  seulement, pas type/statut (ordre de vocabulaire, pas encore porté). Prochain lot :
  docs/react-migration-plan.md § 7.
*/
function searchText(attraction: Attraction): string {
  return [
    attraction.name,
    window.attractionType(attraction.type).label,
    ...attraction.tags,
    attraction.city,
    attraction.county,
    attraction.region,
    attraction.country,
    attraction.address,
    window.coordsLabel(attraction),
  ]
    .filter(Boolean)
    .join(' ');
}
const columns: Column<Attraction>[] = [
  {
    key: 'favorite',
    label: '',
    locked: true,
    sortValue: (attraction) => (attraction.favorite ? 0 : 1),
    render: (attraction) => <FavoriteCell attraction={attraction} />,
  },
  {
    key: 'city',
    label: 'Ville',
    locked: true,
    sortValue: (attraction) => (attraction.city || '').toLowerCase(),
    render: (attraction) => <TextCell value={attraction.city} />,
  },
  {
    key: 'name',
    label: 'Nom',
    locked: true,
    sortValue: (attraction) => (attraction.name || '').toLowerCase(),
    render: (attraction) => <NameCell attraction={attraction} />,
  },
  { key: 'type', label: 'Type', render: (attraction) => <TypeBadge attraction={attraction} /> },
  {
    key: 'status',
    label: 'Statut',
    render: (attraction) => <StatusBadge attraction={attraction} />,
  },
  { key: 'tags', label: 'Tags', render: (attraction) => <TagsCell tags={attraction.tags} /> },
  {
    key: 'description',
    label: 'Description',
    render: (attraction) => <TextCell value={attraction.description} />,
  },
];

export function CitiesView() {
  const attractions = useTravelStore((store) => window.ofCurrentTravel(store.data.attractions));
  const cities = new Set(attractions.map((attraction) => attraction.city).filter(Boolean));

  const [query, setQuery] = useState('');
  const wanted = normalizeSearch(query);
  const items = wanted
    ? attractions.filter((attraction) => normalizeSearch(searchText(attraction)).includes(wanted))
    : attractions;
  const hidden = window.hiddenColumns('cities');
  const visibleColumns = columns.filter((column) => column.locked || !hidden.includes(column.key));

  return (
    <>
      <div className="view-header">
        <div>
          <h2 className="view-title">Villes</h2>
          <p className="view-sub">
            {cities.size} ville{cities.size > 1 ? 's' : ''} — {items.length} lieu
            {items.length > 1 ? 'x' : ''}
          </p>
        </div>
        <div className="view-header-actions">
          <SearchField value={query} onChange={setQuery} />
          <ColumnPicker kind="cities" columns={columns} />
        </div>
      </div>
      {items.length === 0 ? (
        <div className="empty-state">
          <strong>Aucun lieu</strong>
          Ajoute une ville, un village, un premier lieu depuis Lieux & activités.
        </div>
      ) : (
        <DataTable columns={visibleColumns} items={items} />
      )}
    </>
  );
}
