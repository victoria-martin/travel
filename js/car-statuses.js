const UNSET_CAR_STATUS = { label: 'Non renseigné', emoji: '❔' };

const CAR_STATUSES = {
  booked: { label: 'Réservé', emoji: '🔒' },
  toBook: { label: 'À réserver', emoji: '💳' },
  go: { label: 'Go', emoji: '✅' },
  toCheck: { label: 'À voir', emoji: '👀' },
  rejected: { label: 'Écarté', emoji: '👎' },
};

function carStatus(status) {
  return CAR_STATUSES[status] || UNSET_CAR_STATUS;
}

function carStatusKey(status) {
  return CAR_STATUSES[status] ? status : '';
}
