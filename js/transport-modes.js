const UNSET_TRANSPORT_MODE = { label: 'Non renseigné', emoji: '❔', color: '#B4AFA6' };

// Le mode décide des champs utiles : un vol a une compagnie et un numéro, une voiture un carId.
const TRANSPORT_MODES = {
  plane: { label: 'Avion', emoji: '✈️', color: '#4E7A9B', carrier: true },
  train: { label: 'Train', emoji: '🚆', color: '#3E6259', carrier: true },
  bus: { label: 'Bus', emoji: '🚌', color: '#C98A3E', carrier: true },
  ferry: { label: 'Ferry', emoji: '⛴️', color: '#7C8B5E', carrier: true },
  car: { label: 'Voiture', emoji: '🚗', color: '#A6462E', carrier: false },
};

function transportMode(mode) {
  return TRANSPORT_MODES[mode] || UNSET_TRANSPORT_MODE;
}

function transportModeKey(mode) {
  return TRANSPORT_MODES[mode] ? mode : '';
}

function isCarTransport(transport) {
  return transport.mode === 'car';
}
