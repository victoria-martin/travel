// What the scenario planned that day: the step's accommodation and the extras of the step or its group.
function journalPlannedItemsForDay(scenario, date) {
  const step = scenario && stepForJournalDay(scenario, date);
  if (!step) return [];
  const group = getStepGroup(scenario, step.groupId);
  const acc = getAccommodation(step.accommodationId);
  const extras = [...holderExtras(group || {}), ...holderExtras(step)]
    .map(extraAttraction)
    .filter(Boolean);
  return [
    ...(acc ? [{ id: acc.id, name: acc.name, kind: 'accommodation' }] : []),
    ...extras.map((a) => ({ id: a.id, name: a.name, kind: 'attraction' })),
  ];
}
