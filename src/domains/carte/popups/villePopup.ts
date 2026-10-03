import type { Ville } from '@/store/types';

// Port de villePopup (js/views/map/markers.js) en chaîne HTML.
export function villePopup(ville: Ville): string {
  return `<strong>${ville.name}</strong>`;
}
