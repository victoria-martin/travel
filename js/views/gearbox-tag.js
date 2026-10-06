function setCarModelGearbox(id, gearbox) {
  getCarModel(id).gearbox = gearbox;
  saveNow();
  render();
}
