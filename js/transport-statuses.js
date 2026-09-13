const UNSET_TRANSPORT_STATUS = { label: 'Non renseigné', emoji: '❔' };

const TRANSPORT_STATUSES = {
  booked: { label: 'Réservé', emoji: '🔒' },
  toBook: { label: 'À réserver', emoji: '💳' },
  go: { label: 'Go', emoji: '✅' },
  toCheck: { label: 'À voir', emoji: '👀' },
  rejected: { label: 'Écarté', emoji: '👎' },
};

function transportStatus(status) {
  return TRANSPORT_STATUSES[status] || UNSET_TRANSPORT_STATUS;
}

function transportStatusKey(status) {
  return TRANSPORT_STATUSES[status] ? status : '';
}
