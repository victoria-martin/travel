function setAttractionStatus(id, status) {
  getAttraction(id).status = status;
  saveNow();
  render();
}
