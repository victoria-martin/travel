/*
  Une location se prend et se rend à une heure : deux jours entamés se comptent comme deux jours,
  c'est ainsi que les loueurs facturent. Sans date de retour, la location ne compte rien — le prix
  saisi est alors le seul chiffre qu'on ait.
*/
function rentalDays(rental) {
  if (!rental.pickupDate || !rental.dropoffDate) return 0;
  const start = new Date(rental.pickupDate);
  const end = new Date(rental.dropoffDate);
  const days = Math.round((end - start) / 86400000);
  return days > 0 ? days : 1;
}

function rentalDateLabel(date, time) {
  if (!date) return '';
  const [y, m, d] = date.split('-');
  return `${d}/${m}${time ? ` ${time.replace(':', 'h')}` : ''}`;
}

function rentalDatesLabel(rental) {
  const span = [
    rentalDateLabel(rental.pickupDate, rental.pickupTime),
    rentalDateLabel(rental.dropoffDate, rental.dropoffTime),
  ].filter(Boolean);
  const days = rentalDays(rental);
  return [span.join(' → '), days ? `${days} jour${days > 1 ? 's' : ''}` : ''].filter(Boolean);
}
