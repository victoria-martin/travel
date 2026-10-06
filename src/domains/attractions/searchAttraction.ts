import type { Attraction } from '@/store/types';

// Shared by Lieux & activités and Villes: same entity, same searched text.
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
