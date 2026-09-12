// The two ends of a form typed on a single line: confirm and give up, at the end of the line
// itself. A drawer has room for worded buttons under its fields; a line has not.
function confirmButton(act, id, armed) {
  return `<button class="icon-btn icon-ok" id="${id}" data-act="${act}" title="Ajouter"
    ${armed ? '' : 'disabled'}>✓</button>`;
}

function cancelButton(act) {
  return `<button class="icon-btn icon-cancel" data-act="${act}" title="Annuler">✕</button>`;
}
