import { useState } from 'react';
import { useTravelStore } from '../../store/useTravelStore';
import { DataTable } from '../../shared/DataTable/DataTable';
import { SearchField } from '../../shared/SearchField';
import { normalizeSearch } from '../../shared/normalizeSearch';
import { ColumnPicker } from '../../shared/toolbar/ColumnPicker';
import type { Column } from '../../shared/DataTable/types';
import type { Attraction } from '../../store/types';
import { FavoriteCell, NameCell, StatusBadge, TagsCell, TextCell, TypeBadge } from './cells';

/*
  Porte js/views/villes/villes.js + columns.js sur DataTable. `hiddenColumns`/`toggleColumn`
  délégués au legacy (js/columns.js) : COLUMN_SETS.villes reste chargé et porte déjà
  `description: {hiddenByDefault: true}`, une seule source pour la préférence. Pas encore portés
  dans ce lot : menu ⋮, édition en place (type/statut/tags), actions de ligne — tri sur
  ville/nom/favori seulement, pas sur type/statut (ordre de vocabulaire, pas encore porté).
  Prochain lot : docs/react-migration-plan.md § 7.
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

export function VillesView() {
  const attractions = useTravelStore((s) => window.ofCurrentTravel(s.data.attractions));
  const cities = new Set(attractions.map((a) => a.city).filter(Boolean));

  const [query, setQuery] = useState('');
  const wanted = normalizeSearch(query);
  const items = wanted
    ? attractions.filter((a) => normalizeSearch(searchText(a)).includes(wanted))
    : attractions;
  const hidden = window.hiddenColumns('villes');
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
          <ColumnPicker kind="villes" columns={columns} />
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
