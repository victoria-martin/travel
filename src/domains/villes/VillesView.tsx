import { useLegacyState } from '../../store/legacyBridge';

/*
  Spike de la Phase 0a : prouve que le mécanisme de montage (src/main.tsx, REACT_VIEWS) lit la
  donnée legacy en direct. Pas encore le DataTable/columns de la vraie page Villes
  (js/views/villes/) — ça, c'est la Phase 1, une fois ce mécanisme validé.
*/
export function VillesView() {
  const state = useLegacyState();
  const attractions = window.ofCurrentTravel(state?.attractions ?? []);
  const cities = new Set(attractions.map((a: any) => a.city).filter(Boolean));

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
