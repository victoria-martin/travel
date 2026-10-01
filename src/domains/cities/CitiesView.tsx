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
function searchText(a: Attraction): string {
  return [
    a.name,
    window.attractionType(a.type).label,
    ...a.tags,
    a.city,
    a.county,
    a.region,
    a.country,
    a.address,
    window.coordsLabel(a),
  ]
    .filter(Boolean)
    .join(' ');
}
const columns: Column<Attraction>[] = [
  {
    key: 'favorite',
    label: '',
    locked: true,
    sortValue: (a) => (a.favorite ? 0 : 1),
    render: (a) => <FavoriteCell attraction={a} />,
  },
  {
    key: 'city',
    label: 'Ville',
    locked: true,
    sortValue: (a) => (a.city || '').toLowerCase(),
    render: (a) => <TextCell value={a.city} />,
  },
  {
    key: 'name',
    label: 'Nom',
    locked: true,
    sortValue: (a) => (a.name || '').toLowerCase(),
    render: (a) => <NameCell attraction={a} />,
  },
  { key: 'type', label: 'Type', render: (a) => <TypeBadge attraction={a} /> },
  { key: 'status', label: 'Statut', render: (a) => <StatusBadge attraction={a} /> },
  { key: 'tags', label: 'Tags', render: (a) => <TagsCell tags={a.tags} /> },
  { key: 'description', label: 'Description', render: (a) => <TextCell value={a.description} /> },
];

export function CitiesView() {
  const attractions = useTravelStore((s) => window.ofCurrentTravel(s.data.attractions));
  const cities = new Set(attractions.map((a) => a.city).filter(Boolean));

  const [query, setQuery] = useState('');
  const wanted = normalizeSearch(query);
  const items = wanted
    ? attractions.filter((a) => normalizeSearch(searchText(a)).includes(wanted))
    : attractions;
  const hidden = window.hiddenColumns('cities');
  const visibleColumns = columns.filter((c) => c.locked || !hidden.includes(c.key));

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
