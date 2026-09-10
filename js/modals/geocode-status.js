function setGeocodeStatus(message, busy) {
  const status = document.getElementById('geocode-status');
  if (status) status.textContent = message;
  const button = document.getElementById('f-save');
  if (button) button.disabled = !!busy;
}
