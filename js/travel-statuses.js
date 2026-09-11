const DEFAULT_TRAVEL_STATUS = 'idea';

const TRAVEL_STATUSES = {
  idea: { label: 'Idée', emoji: '💭' },
  preparing: { label: 'En préparation', emoji: '🧭' },
  booked: { label: 'Réservé', emoji: '🔒' },
  ongoing: { label: 'En cours', emoji: '✈️' },
  past: { label: 'Passé', emoji: '📦' },
};

function travelStatus(status) {
  return TRAVEL_STATUSES[status] || TRAVEL_STATUSES[DEFAULT_TRAVEL_STATUS];
}
