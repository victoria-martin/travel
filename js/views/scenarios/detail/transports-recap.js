/*
  Le récap de l'onglet Transports : la voiture retenue, reprise telle quelle de son bloc, puis ce
  qu'elle coûte à rouler — les mêmes lignes péages/essence que le groupe Route du total général.
*/
function scenarioTransportsRecap(scenario) {
  return /* HTML */ `<div class="acc-recap-title">Transports</div>
    ${scenarioOfferBlock(scenario)}
    <div class="acc-recap">${roadTollCostRow(scenario)}${roadFuelCostRow(scenario)}</div>`;
}
