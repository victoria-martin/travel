const UNSET_TRANSPORT_MODE = { label: 'Non renseigné', emoji: '❔', color: '#B4AFA6' };

const TRANSPORT_MODES = {
  plane: { label: 'Avion', emoji: '✈️', color: '#4E7A9B' },
  train: { label: 'Train', emoji: '🚆', color: '#3E6259' },
  bus: { label: 'Bus', emoji: '🚌', color: '#C98A3E' },
  ferry: { label: 'Ferry', emoji: '⛴️', color: '#7C8B5E' },
};

function transportMode(mode) {
  return TRANSPORT_MODES[mode] || UNSET_TRANSPORT_MODE;
}

function transportModeKey(mode) {
  return TRANSPORT_MODES[mode] ? mode : '';
}
