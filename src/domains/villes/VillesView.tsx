import { useTravelStore } from '../../store/useTravelStore';

/*
  Spike de la Phase 0a, basculé sur le store en 0b. Pas encore le DataTable/columns de la vraie
  page Villes (js/views/villes/) — ça, c'est la Phase 1, une fois ce mécanisme validé.
*/
export function VillesView() {
  const attractions = useTravelStore((s) => window.ofCurrentTravel(s.data.attractions));
  const cities = new Set(attractions.map((a) => a.city).filter(Boolean));

  return (
    <div className="view-header">
      <div>
        <h2 className="view-title">Villes (spike React)</h2>
        <p className="view-sub">
          {cities.size} ville{cities.size > 1 ? 's' : ''} — {attractions.length} lieu
          {attractions.length > 1 ? 'x' : ''}
        </p>
      </div>
    </div>
  );
}
