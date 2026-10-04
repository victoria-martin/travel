export type Located = {
  address?: string;
  lat: string;
  lng: string;
  country?: string;
  region?: string;
  county?: string;
  city?: string;
};

export function locateSummary(place: Located): string {
  if (place.lat && place.lng)
    return `📍 ${window.placeLevelsLabel(place as Parameters<Window['placeLevelsLabel']>[0]) || 'Position enregistrée'}`;
  if (place.address) return '⚠️ Aucune position — clique sur Localiser, ou saisis les coordonnées.';
  return "Localise une adresse, ou saisis les coordonnées si l'endroit est imprécis.";
}
