function getScenario(id) {
  return state.scenarios.find((s) => s.id === id);
}

function getScenarioCar(scenario) {
  return scenario.carId ? state.cars.find((c) => c.id === scenario.carId) || null : null;
}
