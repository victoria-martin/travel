/*
  Le contenu d'une étape vit dans ses options : lieu, nuits et budget. Une étape ordinaire en porte
  une, une étape qu'on compare en porte plusieurs et une seule est sélectionnée — l'exclusivité se
  tient comme celle du scénario choisi, un drapeau par option plutôt qu'un identifiant sur l'étape.
  Tout l'aval — dates, nuits, totaux, carte — lit l'option sélectionnée et jamais l'étape.
*/
const NO_OPTION = {
  id: null,
  name: '',
  cityId: null,
  accommodationId: null,
  accommodationType: '',
  nights: 0,
  budget: '',
  isSelected: false,
};

function emptyStepOption() {
  return { ...NO_OPTION, id: uid(), nights: 1, isSelected: true };
}

function stepOptions(step) {
  return step.options || [];
}

function getStepOption(step, optionId) {
  return stepOptions(step).find((o) => o.id === optionId) || null;
}

function chosenOption(step) {
  return stepOptions(step).find((o) => o.isSelected) || NO_OPTION;
}

function stepNights(step) {
  return parseInt(chosenOption(step).nights) || 0;
}

// La modale édite l'option qui compte ; sans option sélectionnée, la première fait l'affaire.
function editableOption(step) {
  const chosen = chosenOption(step);
  return chosen.id ? chosen : stepOptions(step)[0] || NO_OPTION;
}

// Le nom est facultatif : sans lui, une option se repère par son rang dans la liste.
function stepOptionName(step, option) {
  return `Option ${stepOptions(step).indexOf(option) + 1}`;
}
