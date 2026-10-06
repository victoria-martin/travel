function setTransportMode(id, mode) {
  getTransport(id).mode = mode;
  saveNow();
  render();
}
