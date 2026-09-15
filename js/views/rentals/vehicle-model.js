/*
  Ce qu'un véhicule est — son nom, sa motorisation, sa boîte — appartient au modèle du voyage ;
  la ligne d'une location n'en garde que la référence, et c'est ce qui rapproche la même Golf prise
  chez deux loueurs. Une voiture reprise d'avant le catalogue porte encore son nom à elle : il
  répond à défaut.
*/
function vehicleCarModel(car) {
  return getCarModel(car.modelId);
}

function vehicleModelName(car) {
  const model = vehicleCarModel(car);
  return model ? model.name : car.model || '';
}

function vehicleWords(car) {
  return vehicleCarModel(car) || car;
}

function vehicleFuelTag(car) {
  return carFuelTag(vehicleWords(car));
}

function vehicleGearboxTag(car) {
  return carGearboxTag(vehicleWords(car));
}
