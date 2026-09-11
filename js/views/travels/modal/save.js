function readTravelForm(id) {
  return {
    id: id || uid(),
    name: document.getElementById('travel-name').value.trim() || 'Sans nom',
    emoji: document.getElementById('travel-emoji').value.trim() || '🧳',
    image: document.getElementById('travel-image').value.trim(),
    description: document.getElementById('travel-description').value.trim(),
    status: document.getElementById('travel-status').value,
    startDate: document.getElementById('travel-start').value,
    endDate: document.getElementById('travel-end').value,
    country: document.getElementById('travel-country').value.trim(),
    region: document.getElementById('travel-region').value.trim(),
    accentColor: document.getElementById('travel-accent').value,
    travelers: parseInt(document.getElementById('travel-travelers').value, 10) || 0,
  };
}

function saveTravel(id) {
  const travel = readTravelForm(id);
  const idx = state.travels.findIndex((t) => t.id === travel.id);
  if (idx === -1) state.travels.push(travel);
  else state.travels[idx] = travel;
  saveNow();
  openTravel(travel.id);
  closeModal();
}
