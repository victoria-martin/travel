function setAttractionType(id, type) {
  getAttraction(id).type = type;
  saveNow();
  render();
}
