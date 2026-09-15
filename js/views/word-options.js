// Les <option> d'un vocabulaire figé, pour les selects de la saisie et des modales du domaine.
function wordOptions(dict, selected) {
  return Object.entries(dict)
    .map(
      ([key, word]) =>
        `<option value="${key}" ${selected === key ? 'selected' : ''}>${word.emoji} ${word.label}</option>`,
    )
    .join('');
}
