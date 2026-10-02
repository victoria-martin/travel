import type { Attraction } from '../../store/types';

// Port de listSearchText('attractions'/'cities') (js/views/table.js) — même entité, même texte.
export function searchAttraction(attraction: Attraction): string {
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
