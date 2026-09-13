/*
  Le champ attractions d'une étape : plusieurs à la fois, cherchées par leur nom. Comme le champ
  tags, il édite modal.payload et repeint son seul bloc — un render complet perdrait les champs
  saisis et pas encore enregistrés.
  Chips et résultats sont deux blocs séparés : la frappe ne repeint que les résultats, sinon le
  champ perdrait sa saisie à chaque lettre.
*/

function stepAttractionsField(p) {
  if (!p.attractions) p.attractions = [];
  return /* HTML */ `<div class="field">
    <label>Attractions</label>
    <div id="step-attractions" class="tags-field">${stepAttractionsChips(p.attractions)}</div>
    <div id="step-attractions-results" class="attraction-results"></div>
  </div>`;
}

function stepAttractionName(entry) {
  const attraction = getAttraction(entry.attractionId);
  return attraction ? attraction.name : 'Attraction supprimée';
}

function stepAttractionsChips(entries) {
  return /* HTML */ `
    ${entries
      .map(
        (entry, i) =>
          `<span class="tag-chip tag-chip-editable">${escapeHtml(stepAttractionName(entry))}<button type="button" class="tag-chip-remove" onclick="removeStepAttraction(${i})" title="Retirer cette attraction">✕</button></span>`,
      )
      .join('')}
    <input
      id="step-attractions-input"
      type="text"
      placeholder="Chercher une attraction…"
      oninput="repaintStepAttractionResults()"
      onkeydown="stepAttractionsKeydown(event)"
    />
  `;
}

function stepAttractionQuery() {
  const input = document.getElementById('step-attractions-input');
  return input ? input.value.trim() : '';
}

function stepAttractionsUsed() {
  return modal.payload.attractions.map((entry) => entry.attractionId);
}

function stepAttractionsKeydown(e) {
  if (e.key !== 'Enter') return;
  e.preventDefault();
  pickFirstAttraction(
    stepAttractionQuery(),
    stepAttractionsUsed(),
    addStepAttraction,
    createStepAttraction,
  );
}

function addStepAttraction(attractionId) {
  modal.payload.attractions.push({ attractionId, count: 1, budget: '' });
  document.getElementById('step-attractions-input').value = '';
  repaintStepAttractionsField();
}

function removeStepAttraction(index) {
  modal.payload.attractions.splice(index, 1);
  repaintStepAttractionsField();
}

function createStepAttraction() {
  const name = stepAttractionQuery();
  if (!name) return;
  addStepAttraction(createAttractionNamed(name).id);
}

function repaintStepAttractionsField() {
  document.getElementById('step-attractions').innerHTML = stepAttractionsChips(
    modal.payload.attractions,
  );
  document.getElementById('step-attractions-input').focus();
  repaintStepAttractionResults();
}

function attractionResults(query, usedIds, pickCall, createCall) {
  if (!query) return '';
  const matches = attractionMatches(query, usedIds);
  if (!matches.length)
    return /* HTML */ `<button
      type="button"
      class="attraction-result attraction-result-create"
      onclick="${createCall}"
    >
      ＋ Créer « ${escapeHtml(query)} »
    </button>`;
  return matches
    .map(
      (a) => `<button type="button" class="attraction-result" onclick="${pickCall(a.id)}">
        ${tagLabel(attractionType(a.type).emoji, escapeHtml(a.name))}
      </button>`,
    )
    .join('');
}

function repaintStepAttractionResults() {
  document.getElementById('step-attractions-results').innerHTML = attractionResults(
    stepAttractionQuery(),
    stepAttractionsUsed(),
    (id) => `addStepAttraction('${id}')`,
    'createStepAttraction()',
  );
}
