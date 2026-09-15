function carLabel(car) {
  return [providerName(car.providerId), car.model].filter(Boolean).join(' · ') || 'Sans nom';
}
