/*
  La barre d'outils ne porte que des gestes sur la vue ; les données du scénario — son étoile, son
  nom, sa date de départ — vivent ensemble dans le bloc d'identité.
*/
function scenarioDetailHeader(s) {
  const count = visibleSteps(s).length;
  return /* HTML */ `<div class="view-header scenario-header">
    <div class="scenario-header-identity">
      <button class="btn-ghost btn btn-small back-link" onclick="goTo('scenarios')">
        ${svgIcon('arrow-left')} Tous les scénarios
      </button>
      <div class="scenario-header-name">
        ${favoriteStar(s.favorite, `toggleScenarioFavorite('${s.id}')`)}
        <div class="scenario-header-name-text">
          <h2 class="view-title">
            ${editableText(s.name, `renameScenario('${s.id}', this.innerText)`, {
              key: `scenario:${s.id}:name`,
              placeholder: 'Nom du scénario…',
            })}
          </h2>
          <p class="view-sub">
            ${scenarioStartDateField(s)} · ${count} étape${count > 1 ? 's' : ''} ·
            ${nightsLabel(totalNights(s))}
          </p>
        </div>
      </div>
    </div>
    <div class="view-header-actions">${toolbarMenu()}</div>
    ${scenarioHeaderMoney(s)}
  </div>`;
}

// Le total ferme la ligne des métadonnées : les GuestPoints d'abord, les euros en grand au bout.
function scenarioHeaderMoney(s) {
  const total = scenarioTotal(s);
  return /* HTML */ `<div class="scenario-header-money">
    ${total.guestPoints ? `<span>${formatGuestPoints(total.guestPoints)}</span>` : ''}
    <strong class="scenario-header-total">${formatEuros(total.euros)}</strong>
  </div>`;
}

function scenarioStartDateField(s) {
  return /* HTML */ `<input
    class="scenario-start-date"
    type="date"
    value="${s.startDate || ''}"
    onchange="setScenarioStartDate('${s.id}', this.value)"
  />`;
}

function setScenarioStartDate(id, date) {
  getScenario(id).startDate = date;
  saveNow();
  render();
}
