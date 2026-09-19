// Suggestion en direct depuis le catalogue ADEME : ne complète que les champs encore vides, et
// n'écrase jamais une valeur déjà tapée.
function suggestCarConsumption() {
  const name = document.getElementById('model-name').value;
  const hint = document.getElementById('model-consumption-hint');
  const match = lookupCarConsumption(name);
  if (!match) {
    hint.textContent = 'ex. 6,5 L/100';
    return;
  }
  const fuelField = document.getElementById('model-fuel');
  const gearboxField = document.getElementById('model-gearbox');
  const consumptionField = document.getElementById('model-consumption');
  if (!fuelField.value && match.fuel) fuelField.value = match.fuel;
  if (!gearboxField.value && match.gearbox) gearboxField.value = match.gearbox;
  if (!consumptionField.value && match.consumption) consumptionField.value = match.consumption;
  hint.textContent = `🔎 ${match.brand} ${match.model}${match.consumption ? ` · ${match.consumption} L/100` : ''}`;
}
