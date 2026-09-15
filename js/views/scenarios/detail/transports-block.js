/*
  Les trajets retenus pour ce scénario. Un transport appartient au voyage — le même vol se compare
  d'un scénario à l'autre — donc le scénario n'en tient que la référence, comme pour les dépenses,
  et le ✕ le retire d'ici sans le supprimer de la page Transports.
*/
function scenarioTransportsBlock(scenario) {
  const transports = getScenarioTransports(scenario);
  return /* HTML */ `<div class="scenario-extra">
    <div class="scenario-extra-head">
      <div class="acc-recap-title">Transports</div>
    </div>
    ${
      transports.length === 0
        ? /* HTML */ `<div class="scenario-extra-empty">
            Aucun trajet rattaché — ceux du voyage restent sur la page Transports.
          </div>`
        : transports.map((t) => scenarioTransportRow(scenario, t)).join('')
    }
    <div class="scenario-extra-actions">
      ${scenarioTransportDropdown(scenario)}
      ${toolbarButton({
        icon: svgIcon('plus'),
        label: 'Ajouter un trajet',
        onclick: `openModal('transport', '', '${scenario.id}')`,
      })}
    </div>
  </div>`;
}

function scenarioTransportRow(scenario, transport) {
  const mode = transportMode(transport.mode);
  const moment = transportMoment(transport.departDate, transport.departTime);
  return /* HTML */ `<div class="expense-line">
    <span class="expense-label"
      >${tagLabel(mode.emoji, escapeHtml(transportLegLabel(transport)))}
      ${moment ? `<span class="expense-unit">${escapeHtml(moment)}</span>` : ''}</span
    >
    <strong class="expense-amount-open">${priceLabel(transport)}</strong>
    <button
      class="icon-btn"
      onclick="detachScenarioTransport('${scenario.id}','${transport.id}')"
      title="Retirer du scénario"
    >
      ${svgIcon('x')}
    </button>
  </div>`;
}

function transportLegLabel(transport) {
  const from = transportEndpointLabel(transport.fromAttractionId, transport.fromPrecision);
  const to = transportEndpointLabel(transport.toAttractionId, transport.toPrecision);
  return `${from} → ${to}`;
}

function attachScenarioTransport(scenarioId, transportId) {
  const scenario = getScenario(scenarioId);
  if (!scenario.transportIds.includes(transportId)) scenario.transportIds.push(transportId);
  saveNow();
  render();
}

// Retirer un trajet du scénario ne le supprime pas : il reste sur la page Transports.
function detachScenarioTransport(scenarioId, transportId) {
  const scenario = getScenario(scenarioId);
  scenario.transportIds = scenario.transportIds.filter((id) => id !== transportId);
  saveNow();
  render();
}
