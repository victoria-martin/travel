import type { Accommodation } from '@/store/types';

// Port de listSearchText('hebergements') (js/views/table.js).
export function searchAccommodation(accommodation: Accommodation): string {
  return [
    accommodation.name,
    window.accType(accommodation.type).label,
    ...accommodation.tags,
    accommodation.city,
    accommodation.county,
    accommodation.region,
    accommodation.country,
    accommodation.address,
    window.coordsLabel(accommodation),
  ]
    .filter(Boolean)
    .join(' ');
}
