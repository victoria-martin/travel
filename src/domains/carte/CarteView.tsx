import { Icon } from '../../shared/Icon';
import { LeafletMap, type MapMarkerData } from '../../platform/web/LeafletMap';
import { useTravelStore } from '../../store/useTravelStore';
import type { Accommodation, Attraction } from '../../store/types';
import { accommodationPopup, attractionPopup } from './popups';

/*
  Porte js/views/map/{map,markers,leaflet-base}.js en lecture seule — premier découpage
  platform/web (docs/react-migration-plan.md § 5) : LeafletMap ne reçoit que des données
  (points, icônes, popups en HTML), jamais un objet Leaflet dans ce fichier. Pas encore portés :
  panneau de filtre, panneau de scénario (tracé + restriction aux hébergements du scénario),
  constructeur d'itinéraire, création de ville, marqueurs villes, menu ⋮, split-pane. Filtrage
  délégué à `keptOnMap` legacy (mapFilters reste à ses valeurs par défaut tant qu'aucun panneau ne
  les change) — tout s'affiche, comme legacy sans filtre actif.
*/
function markerData(
  accommodations: Accommodation[],
  attractions: Attraction[],
): MapMarkerData[] {
  const markers: MapMarkerData[] = [];
  accommodations.forEach((accommodation) => {
    if (!window.keptOnMap('hebergements', accommodation)) return;
    if (!accommodation.lat || !accommodation.lng) return;
    markers.push({
      id: accommodation.id,
      point: [parseFloat(accommodation.lat), parseFloat(accommodation.lng)],
      icon: 'house',
      tooltip: accommodation.name,
      popupHtml: accommodationPopup(accommodation),
      favorite: accommodation.favorite,
    });
  });
  attractions.forEach((attraction) => {
    if (!window.keptOnMap('attractions', attraction)) return;
    if (!attraction.lat || !attraction.lng) return;
    markers.push({
      id: attraction.id,
      point: [parseFloat(attraction.lat), parseFloat(attraction.lng)],
      icon: 'dot',
      tooltip: attraction.name,
      popupHtml: attractionPopup(attraction),
      favorite: attraction.favorite,
    });
  });
  return markers;
}

export function CarteView() {
  const accommodations = useTravelStore((store) =>
    window.ofCurrentTravel(store.data.accommodations),
  );
  const attractions = useTravelStore((store) => window.ofCurrentTravel(store.data.attractions));
  const markers = markerData(accommodations, attractions);

  return (
    <>
      <div className="view-header">
        <div>
          <h2 className="view-title">Carte</h2>
        </div>
      </div>
      <div className="map-layout">
        <div className="map-side">
          <div className="map-side-panel">
            <div className="map-side-title">Légende</div>
            <div className="map-legend-row">
              <span className="map-type-pin">
                <Icon name="house" />
              </span>
              Hébergement
            </div>
            <div className="map-legend-row">
              <span className="map-dot-pin">
                <span />
              </span>
              Lieu &amp; activité
            </div>
          </div>
        </div>
        <LeafletMap markers={markers} />
      </div>
    </>
  );
}
