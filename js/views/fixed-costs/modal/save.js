function saveFixedCost(id) {
  const cost = {
    id: id || uid(),
    label: document.getElementById('cost-label').value.trim(),
    amount: document.getElementById('cost-amount').value.trim(),
    category: document.getElementById('cost-category').value.trim(),
    recurrence: document.getElementById('cost-recurrence').value.trim(),
    notes: document.getElementById('cost-notes').value.trim(),
  };

  if (id) {
    const idx = state.fixedCosts.findIndex((c) => c.id === id);
    state.fixedCosts[idx] = cost;
  } else {
    state.fixedCosts.push(cost);
  }
  saveNow();
  closeModal();
}
