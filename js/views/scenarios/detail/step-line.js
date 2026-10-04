// La ligne d'une étape est portée en JSX :
// src/domains/scenarios/detail/ScenarioDetailView/StepLine.tsx.

// L'heure d'arrivée n'a de sens qu'une fois la réservation faite : avant, elle ne fait que
// promettre un horaire qui n'est pas garanti.
function stepCheckInTimeTag(step) {
  const acc = getAccommodation(step.accommodationId);
  if (!isBookedAccommodation(acc)) return '';
  return /* HTML */ `<span class="step-check-in-time" title="Heure d'arrivée">
    ${svgIcon('clock')}
    ${editableText(acc.checkInTime, `setAccommodationCheckInTime('${acc.id}', this.innerText)`, {
      key: `acc:${acc.id}:checkInTime`,
      placeholder: '',
    })}
  </span>`;
}

// Le ↗ ouvre la fiche du lieu retenu, sans rouvrir le menu pour aller la chercher. Une étape
// posée sur une ville n'en a pas : la fiche est celle d'un hébergement.
function stepSheetButton(step) {
  return step.accommodationId ? accommodationSheetButton(step.accommodationId) : '';
}

// Le statut appartient à l'hébergement : la pastille de l'étape est la sienne, on le change donc
// depuis le trajet sans passer par la page Hébergements. Une étape posée sur une ville n'en a pas.
function stepStatusTag(step) {
  const acc = getAccommodation(step.accommodationId);
  return acc ? accommodationStatusTag(acc) : '';
}

// L'étape porte ses propres dates, l'hébergement sa fenêtre de disponibilité : les deux se
// comparent ici plutôt qu'à la recherche, qui ne dit rien du séjour retenu.
function stepAvailabilityTag(step, arrival) {
  const acc = getAccommodation(step.accommodationId);
  return outOfRangeIndicator(acc ? stepOutOfRange(acc, arrival, stepNights(step)) : null);
}
