/*
  Une voiture se prend et se rend à une heure : deux jours entamés se comptent comme deux jours,
  c'est ainsi que les loueurs facturent. Les dates d'une offre ne servent qu'à dire sur quelle
  durée le tarif relevé valait — un loueur est dégressif — ; le scénario, lui, compte sur les
  siennes.
*/
function daysBetween(from, to) {
  if (!from || !to) return 0;
  const days = Math.round((new Date(to) - new Date(from)) / 86400000);
  return days > 0 ? days : 1;
}

function offerDays(offer) {
  return daysBetween(offer.pickupDate, offer.dropoffDate);
}

function offerDateLabel(date, time) {
  if (!date) return '';
  const [, m, d] = date.split('-');
  return `${d}/${m}${time ? ` ${time.replace(':', 'h')}` : ''}`;
}

function offerDatesLabel(offer) {
  const span = [
    offerDateLabel(offer.pickupDate, offer.pickupTime),
    offerDateLabel(offer.dropoffDate, offer.dropoffTime),
  ].filter(Boolean);
  const days = offerDays(offer);
  return [span.join(' → '), days ? `${days} jour${days > 1 ? 's' : ''}` : ''].filter(Boolean);
}
