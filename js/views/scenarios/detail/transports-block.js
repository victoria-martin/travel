/*
  Les trajets retenus pour ce scénario. Un transport appartient au voyage — le même vol se compare
  d'un scénario à l'autre — donc le scénario n'en tient que la référence, comme pour les dépenses,
  et le ✕ le retire d'ici sans le supprimer de la page Transports.
*/
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
