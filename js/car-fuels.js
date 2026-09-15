// Ce qui fait rouler la voiture, tel que les loueurs le listent.
const CAR_FUELS = {
  petrol: { label: 'Essence', emoji: '⛽' },
  diesel: { label: 'Diesel', emoji: '🛢️' },
  hybrid: { label: 'Hybride', emoji: '🔋' },
  electric: { label: 'Électrique', emoji: '⚡' },
};

const UNSET_CAR_FUEL = { label: 'Non renseignée', emoji: '❔' };

function carFuel(key) {
  return CAR_FUELS[key] || UNSET_CAR_FUEL;
}

function carFuelKey(key) {
  return CAR_FUELS[key] ? key : '';
}
