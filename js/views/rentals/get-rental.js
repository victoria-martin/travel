function getRental(id) {
  return state.rentals.find((r) => r.id === id);
}

function rentalVehicles(rentalId) {
  return state.cars.filter((c) => c.rentalId === rentalId);
}

function vehicleRental(car) {
  return getRental(car.rentalId) || {};
}
