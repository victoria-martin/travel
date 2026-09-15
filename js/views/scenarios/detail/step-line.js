// La ligne d'une étape : ce qu'on y cherche, où l'on dort, où en est la réservation, et combien
// de nuits.
function stepLine(scenario, step) {
  return /* HTML */ `${stepTypeDropdown(scenario, step)} ${stepPlaceDropdown(scenario, step)}
  ${stepStatusTag(step)} ${stepNightsDropdown(scenario, step)}`;
}

// Le statut appartient à l'hébergement : la pastille de l'étape est la sienne, on le change donc
// depuis le trajet sans passer par la page Hébergements. Une étape posée sur une ville n'en a pas.
function stepStatusTag(step) {
  const acc = getAccommodation(step.accommodationId);
  return acc ? accommodationStatusTag(acc) : '';
}
