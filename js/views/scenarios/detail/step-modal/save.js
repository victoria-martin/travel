function saveStep(id) {
  const s = getScenario(modal.scenarioId);
  const withOptions = !id && modal.options === 2;
  const current = (id && s.steps.find((x) => x.id === id)) || modal.payload;
  const item = {
    ...current,
    id: id || uid(),
    name: document.getElementById('s-name').value.trim(),
    arrivalDate: document.getElementById('s-date').value.trim(),
    notes: document.getElementById('s-notes').value.trim(),
    extras: [...(modal.payload.extras || [])],
    nights: parseInt(document.getElementById('s-nights').value) || 0,
    budget: document.getElementById('s-budget').value.trim(),
  };
  if (id) {
    s.steps[s.steps.findIndex((x) => x.id === id)] = item;
  } else {
    s.steps.push(item);
  }
  saveNow();
  closeModal();
  if (withOptions) makeStepGroup(s.id, item.id);
}
