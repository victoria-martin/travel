import { useTravelStore } from '../../store/useTravelStore';
import { DataTable } from '../../shared/DataTable/DataTable';
import type { Column } from '../../shared/DataTable/types';
import type { Attraction } from '../../store/types';
import { FavoriteCell, NameCell, StatusBadge, TagsCell, TextCell, TypeBadge } from './cells';

/*
  Porte js/views/villes/villes.js + columns.js sur DataTable. Pas encore portés dans ce lot :
  recherche, sélecteur de colonnes, menu ⋮, édition en place (type/statut/tags), actions de ligne —
  tri sur ville/nom/favori seulement, pas sur type/statut (ordre de vocabulaire, pas encore porté).
  Prochain lot : docs/react-migration-plan.md § 7.
*/
const columns: Column<Attraction>[] = [
  {
    key: 'favorite',
    label: '',
    sortValue: (a) => (a.favorite ? 0 : 1),
    render: (a) => <FavoriteCell attraction={a} />,
  },
  {
    key: 'city',
    label: 'Ville',
    sortValue: (a) => (a.city || '').toLowerCase(),
    render: (a) => <TextCell value={a.city} />,
  },
  {
    key: 'name',
    label: 'Nom',
    sortValue: (a) => (a.name || '').toLowerCase(),
    render: (a) => <NameCell attraction={a} />,
  },
  { key: 'type', label: 'Type', render: (a) => <TypeBadge type={a.type} /> },
  { key: 'status', label: 'Statut', render: (a) => <StatusBadge status={a.status} /> },
  { key: 'tags', label: 'Tags', render: (a) => <TagsCell tags={a.tags} /> },
  { key: 'description', label: 'Description', render: (a) => <TextCell value={a.description} /> },
];

export function VillesView() {
  const attractions = useTravelStore((s) => window.ofCurrentTravel(s.data.attractions));
  const cities = new Set(attractions.map((a) => a.city).filter(Boolean));

  return (
    <>
      <div className="view-header">
        <div>
          <h2 className="view-title">Villes</h2>
          <p className="view-sub">
            {cities.size} ville{cities.size > 1 ? 's' : ''} — {attractions.length} lieu
            {attractions.length > 1 ? 'x' : ''}
          </p>
        </div>
      </div>
      {attractions.length === 0 ? (
        <div className="empty-state">
          <strong>Aucun lieu</strong>
          Ajoute une ville, un village, un premier lieu depuis Lieux & activités.
        </div>
      ) : (
        <DataTable columns={columns} items={attractions} />
      )}
    </>
  );
}
