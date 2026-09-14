function scenarioDetailHeader(s) {
  const count = visibleSteps(s).length;
  return /* HTML */ `<div class="view-header scenario-header">
    <div class="scenario-header-identity">
      <button class="btn-ghost btn btn-small back-link" onclick="goTo('scenarios')">
        ← Tous les scénarios
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
            ${count} étape${count > 1 ? 's' : ''} · ${nightsLabel(totalNights(s))}
          </p>
        </div>
      </div>
    </div>
    <div class="view-header-actions">
      ${scenarioStartDateField(s)} ${count > 0 ? scenarioSidePanelToggleBtn() : ''}
      ${toolbarPanel({
        key: 'add-step',
        icon: '+',
        label: 'Ajouter une étape',
        body: /* HTML */ ` <button
            class="inline-menu-item"
            onclick="openToolbarPanel = null; openModal('step','${s.id}',null,1)"
          >
            Créer une étape
          </button>
          <button
            class="inline-menu-item"
            onclick="openToolbarPanel = null; openModal('step','${s.id}',null,2)"
          >
            Créer une étape avec options
          </button>`,
      })}
      ${toolbarMenu()}
    </div>
    ${scenarioHeaderMoney(s)}
  </div>`;
}

// Le total se lit comme sur la carte de la liste : les euros en grand, les GuestPoints sous eux.
function scenarioHeaderMoney(s) {
  const total = scenarioTotal(s);
  return /* HTML */ `<div class="scenario-header-money">
    <strong class="scenario-header-total">${formatEuros(total.euros)}</strong>
    ${total.guestPoints ? `<span>${formatGuestPoints(total.guestPoints)}</span>` : ''}
  </div>`;
}

function scenarioStartDateField(s) {
  return /* HTML */ `<label class="header-field">
    Départ
    <input
      type="date"
      value="${s.startDate || ''}"
      onchange="setScenarioStartDate('${s.id}', this.value)"
    />
  </label>`;
}

function setScenarioStartDate(id, date) {
  getScenario(id).startDate = date;
  saveNow();
  render();
}
