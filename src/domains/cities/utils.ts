import type { Attraction } from '../../store/types';

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