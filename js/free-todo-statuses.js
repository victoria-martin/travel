const UNSET_FREE_TODO_STATUS = { label: 'Aucun statut', emoji: '❔' };
window.UNSET_FREE_TODO_STATUS = UNSET_FREE_TODO_STATUS;

const FREE_TODO_STATUSES = {
  toBook: { label: 'À réserver', emoji: '💳' },
  booked: { label: 'Réservé', emoji: '🔒' },
  rejected: { label: 'Écarté', emoji: '👎' },
};
window.FREE_TODO_STATUSES = FREE_TODO_STATUSES;

function freeTodoStatus(status) {
  return FREE_TODO_STATUSES[status] || UNSET_FREE_TODO_STATUS;
}
