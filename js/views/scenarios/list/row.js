function scenarioRow(s, maxNights) {
  const count = visibleSteps(s).length;
  const total = scenarioTotal(s);
  const meta = [nightsLabel(totalNights(s)), `${count} étape${count > 1 ? 's' : ''}`];
  return /* HTML */ `<div
    class="scenario-card ${s.isChosen ? 'is-chosen' : ''}"
    onclick="${compareMode ? `toggleComparedScenario('${s.id}')` : `openScenario('${s.id}')`}"
  >
    <div class="scenario-card-body">
      <div class="scenario-card-head">
        ${compareMode ? scenarioCompareCheck(s) : ''}
        ${favoriteStar(s.favorite, `event.stopPropagation(); toggleScenarioFavorite('${s.id}')`)}
        <h4 class="scenario-card-name">${escapeHtml(s.name)}</h4>
        ${chosenScenarioPill(s)}
      </div>
      <div class="scenario-card-meta">${meta.join(' · ')}</div>
      ${scenarioRouteBar(s, maxNights)}
    </div>
    <div class="scenario-card-money">
      <strong class="scenario-card-total">${formatEuros(total.euros)}</strong>
      ${total.guestPoints ? `<span>${formatGuestPoints(total.guestPoints)}</span>` : ''}
      ${scenarioNightRate(s) ? `<span>${scenarioNightRate(s)}</span>` : ''}
    </div>
    <div class="scenario-card-actions" onclick="event.stopPropagation();">
      ${duplicateButton(`duplicateScenario('${s.id}')`)} ${deleteButton('scenarios', s.id)}
    </div>
  </div>`;
}

// Les GuestPoints ne se ramènent pas à une nuit en euros : le prix par nuit ne compte que les euros.
function scenarioNightRate(s) {
  const nights = totalNights(s);
  return nights ? `${formatEuros(scenarioTotal(s).euros / nights)}/nuit` : '';
}

// La ligne entière coche déjà : la case ne fait que montrer l'état, elle n'agit pas deux fois.
function scenarioCompareCheck(s) {
  return /* HTML */ `<input
    type="checkbox"
    class="scenario-compare-check"
    ${isComparedScenario(s.id) ? 'checked' : ''}
    tabindex="-1"
    aria-label="Comparer ${escapeHtml(s.name)}"
  />`;
}
