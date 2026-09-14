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

// L'état se lit sans survol sur le scénario retenu ; sur les autres, l'invite n'apparaît qu'au
// survol de la carte, sinon la liste porterait autant d'appels à l'action que de lignes.
function chosenScenarioPill(s) {
  return /* HTML */ `<button
    class="scenario-chosen-pill ${s.isChosen ? 'is-chosen' : ''}"
    onclick="event.stopPropagation(); setChosenScenario('${s.id}')"
    title="${s.isChosen ? 'Ne plus être le scénario choisi' : 'Scénario choisi'}"
  >
    ${s.isChosen ? '● choisi' : 'choisir'}
  </button>`;
}
