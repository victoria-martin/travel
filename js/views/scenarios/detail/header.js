function setScenarioStartDate(id, date) {
  getScenario(id).startDate = date;
  saveNow();
  render();
}
