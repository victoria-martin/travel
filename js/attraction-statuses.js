const UNSET_ATTRACTION_STATUS = { label: 'Non renseigné', emoji: '❔' };

const ATTRACTION_STATUSES = {
  toCheck: { label: 'À voir', emoji: '👀' },
  go: { label: 'Go', emoji: '✅' },
  visited: { label: 'Vu', emoji: '☑️' },
  rejected: { label: 'Écarté', emoji: '👎' },
};

function attractionStatus(status) {
  return ATTRACTION_STATUSES[status] || UNSET_ATTRACTION_STATUS;
}

function attractionStatusKey(status) {
  return ATTRACTION_STATUSES[status] ? status : '';
}
