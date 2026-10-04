// Un seul scénario choisi par voyage : le choisir démarque les autres, le re-cliquer n'en laisse aucun.
function setChosenScenario(id) {
  const wasChosen = !!getScenario(id).isChosen;
  ofCurrentTravel(state.scenarios).forEach((s) => (s.isChosen = !wasChosen && s.id === id));
  saveNow();
  render();
}

function chosenScenario() {
  return ofCurrentTravel(state.scenarios).find((s) => s.isChosen) || null;
}

