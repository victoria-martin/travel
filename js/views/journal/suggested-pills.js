/*
  Deux sens entre le texte et le scénario. Dans un sens : ce que le scénario a déjà planifié ce
  jour-là (hébergement, activités en extra de l'étape ou de son groupe) se propose en pastilles,
  cliquer en insère la référence dans le texte. Dans l'autre : une référence tapée dans le texte qui
  ne correspond à aucune activité déjà planifiée ce jour-là se signale, avec un bouton pour
  l'attacher à l'étape — jamais en silence, une faute de frappe dans {} ne doit rien écrire seule.
*/
let journalPlannedItems = [];
let journalMissingRefs = [];

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

function journalPlannedPillsHtml(scenario, date) {
  journalPlannedItems = journalPlannedItemsForDay(scenario, date);
  if (!journalPlannedItems.length) return '';
  return /* HTML */ `<div class="journal-planned">
    <span class="journal-planned-label">Planifiés :</span>
    ${journalPlannedItems
      .map(
        (item, i) => /* HTML */ `<button class="journal-planned-pill" onclick="journalInsertPlannedRef(${i}, '${date}')">
          ${item.kind === 'accommodation' ? svgIcon('house') : svgIcon('landmark')}
          ${escapeHtml(item.name)}
        </button>`,
      )
      .join('')}
  </div>`;
}

function journalInsertPlannedRef(index, date) {
  const item = journalPlannedItems[index];
  if (item) journalInsertRef(item.name, date);
}

function journalInsertRef(name, date) {
  const textarea = document.getElementById('journal-text');
  if (!textarea) return;
  const start = textarea.selectionStart ?? textarea.value.length;
  const end = textarea.selectionEnd ?? textarea.value.length;
  const insert = `{${name}}`;
  textarea.value = `${textarea.value.slice(0, start)}${insert}${textarea.value.slice(end)}`;
  textarea.selectionStart = textarea.selectionEnd = start + insert.length;
  textarea.focus();
  journalTextChanged(textarea, date);
}

function journalUnresolvedRefsHtml(date, text) {
  const scenario = getScenario(prefs.journalScenarioId);
  const step = scenario && stepForJournalDay(scenario, date);
  if (!scenario || !step) return '';
  const planned = new Set(journalPlannedItemsForDay(scenario, date).map((i) => i.id));
  const seen = new Set();
  journalMissingRefs = journalTextRefs(text)
    .map((r) => r.entity)
    .filter((entity) => entity && entity.kind === 'attraction' && !planned.has(entity.id))
    .filter((entity) => (seen.has(entity.id) ? false : seen.add(entity.id)));
  if (!journalMissingRefs.length) return '';
  return /* HTML */ `<div class="journal-missing-refs">
    ${journalMissingRefs
      .map(
        (item, i) => /* HTML */ `<span class="journal-missing-ref">
          ${escapeHtml(item.name)} n'est pas encore dans ce scénario ce jour-là
          <button class="link-btn" onclick="journalAttachRefToStep(${i}, '${date}')">
            Ajouter au scénario
          </button>
        </span>`,
      )
      .join('')}
  </div>`;
}

function journalAttachRefToStep(index, date) {
  const item = journalMissingRefs[index];
  const scenario = getScenario(prefs.journalScenarioId);
  const step = scenario && stepForJournalDay(scenario, date);
  if (!item || !scenario || !step) return;
  attachExtraAttraction(scenario.id, step.id, item.id);
}
