const UNSET_ACCOMMODATION_STATUS = { label: 'Non renseigné', emoji: '❔' };

const ACCOMMODATION_STATUSES = {
  booked: { label: 'Réservé', emoji: '🔒' },
  contacted: { label: 'Contacté', emoji: '✉️' },
  awaitingReply: { label: 'Attente réponse', emoji: '⏳' },
  toBook: { label: 'À booker', emoji: '💳' },
  go: { label: 'Go', emoji: '✅' },
  interested: { label: 'Intéressé', emoji: '👍' },
  toCheck: { label: 'À voir', emoji: '👀' },
  to: { label: 'À trier', emoji: '👀' },
  notAvailable: { label: 'Pas dispo', emoji: '🚫' },
  rejected: { label: 'Écarté', emoji: '👎' },
};

function accStatus(status) {
  return ACCOMMODATION_STATUSES[status] || UNSET_ACCOMMODATION_STATUS;
}

function accStatusKey(status) {
  return ACCOMMODATION_STATUSES[status] ? status : '';
}

function accStatusFromText(text) {
  const wanted = (text || '').trim().toLowerCase();
  if (!wanted) return '';
  const found = Object.keys(ACCOMMODATION_STATUSES).find(
    (key) => key.toLowerCase() === wanted || accStatus(key).label.toLowerCase() === wanted,
  );
  return found || '';
}

// Réservé est le seul statut que l'écran marque : une étape dont l'hébergement est pris se lit
// sans lire sa pastille.
function isBookedAccommodation(acc) {
  return !!acc && accStatusKey(acc.status) === 'booked';
}
