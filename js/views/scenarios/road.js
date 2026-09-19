/*
  Conduire coûte deux choses que le tracé sait dire : l'essence que la voiture brûle sur ces
  kilomètres, et le péage qu'on paie à les parcourir. Les deux se dérivent de la distance OSRM du
  scénario et ne s'enregistrent nulle part — déplacer une étape les refait.

  Le péage porte sur toute la distance : OSRM ne dit pas quelle part est à péage, donc c'est un
  tarif au kilomètre et non une addition de barrières. C'est un ordre de grandeur, pas une facture.
*/

function scenarioRoadPoints(scenario) {
  return visibleSteps(scenario).map(coordsFor).filter(Boolean);
}

// En kilomètres, `null` tant que la route n'est pas revenue, 0 s'il n'y a pas deux lieux à relier.
function scenarioRoadKm(scenario) {
  const points = scenarioRoadPoints(scenario);
  if (points.length < 2) return 0;
  const metres = routeDistance(points);
  return metres === null ? null : metres / 1000;
}

// La voiture du scénario est celle de son offre : sans offre retenue, rien ne brûle.
function scenarioCarModel(scenario) {
  const offer = getScenarioOffer(scenario);
  return offer ? getCarModel(offer.modelId) : null;
}

function scenarioFuelConsumption(scenario) {
  const model = scenarioCarModel(scenario);
  return model ? priceNumber(model.consumption) : 0;
}

function scenarioFuelCalc(scenario) {
  const km = scenarioRoadKm(scenario) || 0;
  return (km / 100) * scenarioFuelConsumption(scenario) * travelFuelPrice();
}

function scenarioTollCalc(scenario) {
  return (scenarioRoadKm(scenario) || 0) * travelTollRate();
}

// Comme sur une étape, le budget saisi à la main remplace le calcul dès qu'il est renseigné.
function scenarioFuelCost(scenario) {
  return hasPriceValue(scenario.fuelBudget)
    ? priceNumber(scenario.fuelBudget)
    : scenarioFuelCalc(scenario);
}

function scenarioTollCost(scenario) {
  return hasPriceValue(scenario.tollBudget)
    ? priceNumber(scenario.tollBudget)
    : scenarioTollCalc(scenario);
}

function scenarioRoadTotal(scenario) {
  return scenarioFuelCost(scenario) + scenarioTollCost(scenario);
}
