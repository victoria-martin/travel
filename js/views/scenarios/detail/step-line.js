// La ligne d'une étape : ce qu'on y cherche, où l'on dort, et combien de nuits.
function stepLine(scenario, step) {
  return /* HTML */ `${stepTypeDropdown(scenario, step)} ${stepPlaceDropdown(scenario, step)}
  ${stepNightsDropdown(scenario, step)}`;
}
