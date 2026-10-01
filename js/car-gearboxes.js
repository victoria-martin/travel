const CAR_GEARBOXES = {
  automatic: { label: 'Automatique', emoji: '⚙️' },
  manual: { label: 'Manuelle', emoji: '🕹️' },
};
window.CAR_GEARBOXES = CAR_GEARBOXES;

const UNSET_CAR_GEARBOX = { label: 'Non renseignée', emoji: '❔' };
window.UNSET_CAR_GEARBOX = UNSET_CAR_GEARBOX;

function carGearbox(key) {
  return CAR_GEARBOXES[key] || UNSET_CAR_GEARBOX;
}

function carGearboxKey(key) {
  return CAR_GEARBOXES[key] ? key : '';
}
