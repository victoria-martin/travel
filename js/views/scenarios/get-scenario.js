function getScenario(id) {
  return state.scenarios.find((s) => s.id === id);
}

function getScenarioTransports(scenario) {
  return (scenario.transportIds || [])
    .map((id) => state.transports.find((t) => t.id === id))
    .filter(Boolean);
}

function getScenarioCar(scenario) {
  return scenario.carId ? state.cars.find((c) => c.id === scenario.carId) || null : null;
}
