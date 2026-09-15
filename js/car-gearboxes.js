const CAR_GEARBOXES = {
  automatic: { label: 'Automatique', emoji: '⚙️' },
  manual: { label: 'Manuelle', emoji: '🕹️' },
};

const UNSET_CAR_GEARBOX = { label: 'Non renseignée', emoji: '❔' };

function carGearbox(key) {
  return CAR_GEARBOXES[key] || UNSET_CAR_GEARBOX;
}

function carGearboxKey(key) {
  return CAR_GEARBOXES[key] ? key : '';
}
