const UNSET_ATTRACTION_STATUS = { label: 'Non renseigné', emoji: '❔' };
window.UNSET_ATTRACTION_STATUS = UNSET_ATTRACTION_STATUS;

const ATTRACTION_STATUSES = {
  toSort: { label: 'À trier', emoji: '📥' },
  toCheck: { label: 'À voir', emoji: '👀' },
  go: { label: 'Go', emoji: '✅' },
  visited: { label: 'Vu', emoji: '☑️' },
  rejected: { label: 'Écarté', emoji: '👎' },
};
window.ATTRACTION_STATUSES = ATTRACTION_STATUSES;

function attractionStatus(status) {
  return ATTRACTION_STATUSES[status] || UNSET_ATTRACTION_STATUS;
}

function attractionStatusKey(status) {
  return ATTRACTION_STATUSES[status] ? status : '';
}
