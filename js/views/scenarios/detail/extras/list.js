// Le bloc d'un porteur, sous la ligne de son hébergement : ses lignes, puis celle qui les complète.
// Une étape et un groupe rendent le même bloc, chacun sur ses propres lignes.
function extrasBlock(scenario, holder) {
  return /* HTML */ `<div class="step-extras">
    ${holderExtras(holder)
      .map((line) => extraRow(scenario, holder, line))
      .join('')}
    ${extraAddRow(scenario, holder)}
  </div>`;
}
