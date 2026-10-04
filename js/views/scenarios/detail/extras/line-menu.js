// La pastille d'une ligne (ses alternatives du même genre) est portée en JSX :
// src/domains/scenarios/detail/ScenarioDetailView/ExtrasBlock/ExtraMenu.tsx. extraSiblingIds
// reste ici, encore lue par ce composant.
function extraSiblingIds(holder, line, field) {
  return holderExtras(holder)
    .filter((other) => other.id !== line.id)
    .map((other) => other[field])
    .filter(Boolean);
}
