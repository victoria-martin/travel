/*
  Une location se déplie pour montrer ses véhicules. C'est le geste en cours et non une préférence
  qu'on retrouve, comme l'onglet des transports : une globale de module. Une location qu'on vient
  de créer s'ouvre, c'est là qu'on va taper ses véhicules.
*/
let openRentalIds = [];

function isRentalOpen(id) {
  return openRentalIds.includes(id);
}

function openRental(id) {
  if (!isRentalOpen(id)) openRentalIds = openRentalIds.concat(id);
}

function toggleRental(id) {
  openRentalIds = isRentalOpen(id)
    ? openRentalIds.filter((x) => x !== id)
    : openRentalIds.concat(id);
  render();
}
