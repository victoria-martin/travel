const UNSET_FREE_TODO_STATUS = { label: 'Aucun statut', emoji: '❔' };

const FREE_TODO_STATUSES = {
  toBook: { label: 'À réserver', emoji: '💳' },
  booked: { label: 'Réservé', emoji: '🔒' },
  rejected: { label: 'Écarté', emoji: '👎' },
};

function freeTodoStatus(status) {
  return FREE_TODO_STATUSES[status] || UNSET_FREE_TODO_STATUS;
}
