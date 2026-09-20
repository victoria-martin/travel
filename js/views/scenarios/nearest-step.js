/*
  Rattacher un point au plan sans faire choisir d'étape : on prend celle dont l'hébergement est
  géographiquement le plus proche, à vol d'oiseau faute de route calculable hors ligne. Deux
  appelants (attractions/modal/add-to-scenario.js, map/route-to-scenario.js).
*/
const EARTH_RADIUS_KM = 6371;

function haversineKm([lat1, lng1], [lat2, lng2]) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a));
}

function nearestAccommodationStep(scenario, point) {
  const from = [parseFloat(point.lat), parseFloat(point.lng)];
  const ranked = visibleSteps(scenario)
    .map((step) => {
      const acc = step.accommodationId && getAccommodation(step.accommodationId);
      if (!acc || !acc.lat || !acc.lng) return null;
      return { step, distance: haversineKm(from, [parseFloat(acc.lat), parseFloat(acc.lng)]) };
    })
    .filter(Boolean)
    .sort((a, b) => a.distance - b.distance);
  return ranked.length ? ranked[0].step : null;
}
