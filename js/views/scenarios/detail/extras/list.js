// Le bloc d'un porteur, sous la ligne de son hébergement : ses lignes, puis celle qui les complète.
// L'étape et chacune de ses options rendent le même bloc, chacun sur ses propres lignes.
function extrasBlock(scenario, step, optionId) {
  return /* HTML */ `<div class="step-extras">
    ${holderExtras(step, optionId)
      .map((line) => extraRow(scenario, step, line))
      .join('')}
    ${extraAddRow(scenario, step, optionId)}
  </div>`;
}
