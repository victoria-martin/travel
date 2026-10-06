function setCarModelFuel(id, fuel) {
  getCarModel(id).fuel = fuel;
  saveNow();
  render();
}
