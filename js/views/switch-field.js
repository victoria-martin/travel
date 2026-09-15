/*
  Une préférence qui n'a que deux états se bascule d'un interrupteur : il dit son état de loin, là
  où une case cochée demande de la lire. Le champ reste une case à cocher pour le clavier — seule
  sa peinture change.
*/
function switchField(label, checked, onChange) {
  return /* HTML */ `<label class="switch-option">
    <input type="checkbox" ${checked ? 'checked' : ''} onchange="${onChange}" />
    <span class="switch-track"></span>
    <span class="switch-label">${label}</span>
  </label>`;
}
