// Ce qui fait rouler la voiture, tel que les loueurs le listent.
const CAR_FUELS = {
  petrol: { label: 'Essence', emoji: '⛽' },
  diesel: { label: 'Diesel', emoji: '🛢️' },
  hybrid: { label: 'Hybride', emoji: '🔋' },
  electric: { label: 'Électrique', emoji: '⚡' },
};
window.CAR_FUELS = CAR_FUELS;

const UNSET_CAR_FUEL = { label: 'Non renseignée', emoji: '❔' };
window.UNSET_CAR_FUEL = UNSET_CAR_FUEL;

function carFuel(key) {
  return CAR_FUELS[key] || UNSET_CAR_FUEL;
}

function carFuelKey(key) {
  return CAR_FUELS[key] ? key : '';
}
