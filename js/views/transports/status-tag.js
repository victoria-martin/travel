function setTransportStatus(id, status) {
  getTransport(id).status = status;
  saveNow();
  render();
}
