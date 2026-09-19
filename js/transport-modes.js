const UNSET_TRANSPORT_MODE = { label: 'Non renseigné', emoji: '❔', color: '#B4AFA6' };

const TRANSPORT_MODES = {
  plane: { label: 'Avion', emoji: '✈️', color: '#4E7A9B' },
  train: { label: 'Train', emoji: '🚆', color: '#3E6259' },
  bus: { label: 'Bus', emoji: '🚌', color: '#C98A3E' },
  ferry: { label: 'Ferry', emoji: '⛴️', color: '#7C8B5E' },
};

// Un loueur voiture est un prestataire, pas un trajet : la voiture rejoint le mot ici, pas dans
// TRANSPORT_MODES, dont le vocabulaire ne sert plus qu'aux trajets datés.
const PROVIDER_MODES = { ...TRANSPORT_MODES, car: { label: 'Voiture', emoji: '🚗', color: '#A6462E' } };

// Les modes qu'un voyage peut suivre dans Transports, voiture en tête puisqu'elle reste cochée
// par défaut.
const TRACKABLE_MODES = ['car', ...Object.keys(TRANSPORT_MODES)];

function transportMode(mode) {
  return TRANSPORT_MODES[mode] || UNSET_TRANSPORT_MODE;
}

function transportModeKey(mode) {
  return TRANSPORT_MODES[mode] ? mode : '';
}

function providerMode(mode) {
  return PROVIDER_MODES[mode] || UNSET_TRANSPORT_MODE;
}

function providerModeKey(mode) {
  return PROVIDER_MODES[mode] ? mode : '';
}
