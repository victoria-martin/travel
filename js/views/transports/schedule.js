function transportMoment(date, time) {
  return [date, time].filter(Boolean).join(' ');
}
