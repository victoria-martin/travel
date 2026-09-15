// Une location se nomme par son loueur et le lieu où on prend la voiture.
function rentalLabel(rental) {
  return (
    [providerName(rental.providerId), rental.location].filter(Boolean).join(' · ') || 'Sans nom'
  );
}
