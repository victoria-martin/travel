function transportMoment(date, time) {
  return [date, time].filter(Boolean).join(' ');
}

function transportScheduleCell(date, time) {
  const moment = transportMoment(date, time);
  return moment ? escapeHtml(moment) : '—';
}
