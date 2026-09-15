function pickScenarioTransport(scenarioId, transportId) {
  openInlineMenu = null;
  attachScenarioTransport(scenarioId, transportId);
}

function scenarioTransportDropdown(scenario) {
  const attachable = ofCurrentTravel(state.transports).filter(
    (t) => !scenario.transportIds.includes(t.id),
  );
  return inlineDropdown(
    `transport:${scenario.id}`,
    'transport-dropdown',
    /* HTML */ `<summary class="inline-tag">
        ${tagLabel(svgIcon('plane'), 'Rattacher un trajet')}
      </summary>
      <div class="inline-menu">
        ${
          attachable.length === 0
            ? '<div class="inline-menu-group">Aucun trajet à rattacher</div>'
            : attachable
                .map(
                  (t) => `<button
                  class="inline-menu-item"
                  onclick="pickScenarioTransport('${scenario.id}','${t.id}')"
                >
                  <span class="inline-emoji">${transportMode(t.mode).emoji}</span>
                  <span class="inline-label">${escapeHtml(transportLegLabel(t))}</span>
                  <span class="inline-menu-aside">${priceLabel(t)}</span>
                </button>`,
                )
                .join('')
        }
      </div>`,
  );
}
