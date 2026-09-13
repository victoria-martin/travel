function saveStep(id) {
  const s = getScenario(modal.scenarioId);
  const current = (id && s.steps.find((x) => x.id === id)) || modal.payload;
  const edited = editableOption(current);
  const item = {
    id: id || uid(),
    name: document.getElementById('s-name').value.trim(),
    region: document.getElementById('s-region').value.trim(),
    arrivalDate: document.getElementById('s-date').value.trim(),
    notes: document.getElementById('s-notes').value.trim(),
    extras: [...(modal.payload.extras || [])],
    hidden: !!current.hidden,
    options: stepOptions(current).map((o) =>
      o.id === edited.id
        ? {
            ...o,
            nights: parseInt(document.getElementById('s-nights').value) || 0,
            budget: document.getElementById('s-budget').value.trim(),
          }
        : o,
    ),
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
