/*
  Le prix du litre et le péage au kilomètre sont du voyage et non d'un scénario : on y compare des
  itinéraires, pas des carburants. Laissés vides, ils retombent sur un ordre de grandeur — la route
  se chiffre avant qu'on ait rien relevé, et le champ dit lequel en placeholder.
*/
const DEFAULT_FUEL_PRICE = 2.3;
const DEFAULT_TOLL_RATE = 0.08;

function travelFuelPrice() {
  const travel = currentTravel();
  return (travel && priceNumber(travel.fuelPrice)) || DEFAULT_FUEL_PRICE;
}

function travelTollRate() {
  const travel = currentTravel();
  return (travel && priceNumber(travel.tollRate)) || DEFAULT_TOLL_RATE;
}
