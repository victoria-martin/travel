function saveStep(id) {
  const s = getScenario(modal.scenarioId);
  const current = (id && s.steps.find((x) => x.id === id)) || emptyStep();
  const item = {
    id: id || uid(),
    city: document.getElementById('s-city').value.trim(),
    region: document.getElementById('s-region').value.trim(),
    nights: parseInt(document.getElementById('s-nights').value) || 0,
    arrivalDate: document.getElementById('s-date').value.trim(),
    budget: document.getElementById('s-budget').value.trim(),
    notes: document.getElementById('s-notes').value.trim(),
    attractions: [...(modal.payload.attractions || [])],
    cityId: current.cityId || null,
    accommodationId: current.accommodationId || null,
    hidden: !!current.hidden,
  };
  if (id) {
    const idx = s.steps.findIndex((x) => x.id === id);
    s.steps[idx] = item;
  } else {
    s.steps.push(item);
  }
  saveNow();
  closeModal();
}
