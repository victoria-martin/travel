const DEFAULT_TRAVEL_STATUS = 'idea';
window.DEFAULT_TRAVEL_STATUS = DEFAULT_TRAVEL_STATUS;

const TRAVEL_STATUSES = {
  idea: { label: 'Idée', emoji: '💭' },
  preparing: { label: 'En préparation', emoji: '🧭' },
  booked: { label: 'Réservé', emoji: '🔒' },
  ongoing: { label: 'En cours', emoji: '✈️' },
  past: { label: 'Passé', emoji: '📦' },
};
window.TRAVEL_STATUSES = TRAVEL_STATUSES;

function travelStatus(status) {
  return TRAVEL_STATUSES[status] || TRAVEL_STATUSES[DEFAULT_TRAVEL_STATUS];
}
