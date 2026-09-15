function saveFixedCost(id) {
  const { scenarioId } = modal;
  const cost = {
    id: id || uid(),
    travelId: currentTravelId(),
    label: document.getElementById('cost-label').value.trim(),
    amount: document.getElementById('cost-amount').value.trim(),
    categories: [...modal.payload.categories],
    recurrence: document.getElementById('cost-recurrence').value,
    notes: document.getElementById('cost-notes').value.trim(),
  };

  if (id) {
    const idx = state.fixedCosts.findIndex((c) => c.id === id);
    state.fixedCosts[idx] = cost;
  } else {
    state.fixedCosts.push(cost);
  }
  const scenario = scenarioId ? getScenario(scenarioId) : null;
  if (scenario && !scenario.costIds.includes(cost.id)) scenario.costIds.push(cost.id);
  saveNow();
  closeModal();
}
