const DEFAULT_ACCOMMODATION_STATUS = 'toCheck';

const ACCOMMODATION_STATUSES = {
  booked: { label: 'Réservé', emoji: '🔒' },
  contacted: { label: 'Contacté', emoji: '✉️' },
  awaitingReply: { label: 'Attente réponse', emoji: '⏳' },
  toBook: { label: 'À booker', emoji: '💳' },
  go: { label: 'Go', emoji: '✅' },
  interested: { label: 'Intéressé', emoji: '👍' },
  toCheck: { label: 'À voir', emoji: '👀' },
  notAvailable: { label: 'Pas dispo', emoji: '🚫' },
  rejected: { label: 'Écarté', emoji: '👎' },
};

function accStatus(status) {
  return ACCOMMODATION_STATUSES[status] || ACCOMMODATION_STATUSES[DEFAULT_ACCOMMODATION_STATUS];
}

function accStatusKey(status) {
  return ACCOMMODATION_STATUSES[status] ? status : DEFAULT_ACCOMMODATION_STATUS;
}

function accStatusFromText(text) {
  const wanted = (text || '').trim().toLowerCase();
  if (!wanted) return DEFAULT_ACCOMMODATION_STATUS;
  const found = Object.keys(ACCOMMODATION_STATUSES).find(
    (key) => key.toLowerCase() === wanted || accStatus(key).label.toLowerCase() === wanted,
  );
  return found || DEFAULT_ACCOMMODATION_STATUS;
}
