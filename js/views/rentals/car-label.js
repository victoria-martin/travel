// Un véhicule se nomme par son loueur et son modèle ; le loueur vit sur sa location.
function carLabel(car) {
  return (
    [providerName(vehicleRental(car).providerId), car.model].filter(Boolean).join(' · ') ||
    'Sans nom'
  );
}
