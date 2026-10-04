// La ligne d'un extra est portée en JSX :
// src/domains/scenarios/detail/ScenarioDetailView/ExtrasBlock/ExtraRow.tsx.

function extraStatusTag(line) {
  const attraction = extraAttraction(line);
  return attraction ? attractionStatusTag(attraction) : '';
}
