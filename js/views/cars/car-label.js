function carLabel(car) {
  return [car.name, car.model].filter(Boolean).join(' · ') || 'Sans nom';
}
