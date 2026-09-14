function scenarioRow(s) {
  const count = visibleSteps(s).length;
  const dates = scenarioDateRange(s);
  const rate = scenarioNightRate(s);
  const guestPoints = scenarioTotal(s).guestPoints;
  return /* HTML */ `<div
    class="scenario-row"
    onclick="${compareMode ? `toggleComparedScenario('${s.id}')` : `openScenario('${s.id}')`}"
  >
    <div style="display:flex; gap:10px; align-items:center;">
      ${compareMode ? scenarioCompareCheck(s) : ''}
      <span onclick="event.stopPropagation();">
        ${chosenScenarioButton(s)} ${favoriteStar(s.favorite, `toggleScenarioFavorite('${s.id}')`)}
      </span>
      <div>
        <h4>${escapeHtml(s.name)}</h4>
        <span
          >${[nightsLabel(totalNights(s)), dates, `${count} étape${count > 1 ? 's' : ''}`]
            .filter(Boolean)
            .join(' — ')}</span
        >
      </div>
    </div>
    <div style="display:flex; gap:18px; align-items:center;">
      <div style="display:flex; flex-direction:column; align-items:flex-end;">
        <strong>${formatEuros(scenarioTotal(s).euros)}</strong>
        ${guestPoints ? `<span>${formatGuestPoints(guestPoints)}</span>` : ''}
        ${rate ? `<span>${rate}</span>` : ''}
      </div>
      <div style="display:flex; gap:6px;" onclick="event.stopPropagation();">
        ${duplicateButton(`duplicateScenario('${s.id}')`)} ${deleteButton('scenarios', s.id)}
      </div>
    </div>
  </div>`;
}

// Le scénario part de sa date de départ et dure ses nuits : ses étapes n'ont pas à être parcourues.
function scenarioDateRange(s) {
  const start = stepArrival(s, 0);
  if (!start) return '';
  const nights = totalNights(s);
  if (!nights) return escapeHtml(formatStepDay(start));
  const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + nights);
  return escapeHtml(`${formatStepDay(start)} → ${formatStepDay(end)}`);
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
