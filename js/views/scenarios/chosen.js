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

function chosenScenarioButton(s) {
  return /* HTML */ `<button
    class="icon-btn"
    style="border:none; font-size:15px; flex-shrink:0; color:${
      s.isChosen ? '#C98A3E' : 'var(--line)'
    };"
    onclick="setChosenScenario('${s.id}')"
    title="${s.isChosen ? 'Ne plus être le scénario choisi' : 'Scénario choisi'}"
  >
    ${s.isChosen ? '◉' : '○'}
  </button>`;
}
