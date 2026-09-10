function renderScenariosView() {
  return /* HTML */ `
    <div class="view-header">
      <div>
        <h2 class="view-title">Scénarios</h2>
        <p class="view-sub">Compare différentes versions de ton itinéraire</p>
      </div>
      <button class="btn" onclick="createScenario()">+ Nouveau scénario</button>
    </div>
    ${
      state.scenarios.length === 0
        ? emptyState('Aucun scénario', 'Crée un premier scénario pour poser tes étapes.')
        : `
      <div class="scenario-list">
        ${state.scenarios
          .map(
            (s) => `
          <div class="scenario-row" onclick="openScenario('${s.id}')">
            <div>
              <h4>${escapeHtml(s.name)}</h4>
              <span>${s.steps.length} étape${s.steps.length > 1 ? 's' : ''} — ${nightsLabel(totalNights(s))}</span>
            </div>
            <div style="display:flex; gap:6px;" onclick="event.stopPropagation();">
              <button class="icon-btn" onclick="duplicateScenario('${s.id}')" title="Dupliquer">⧉</button>
              <button class="icon-btn" onclick="deleteItem('scenarios','${s.id}')" title="Supprimer">🗑</button>
            </div>
          </div>
        `,
          )
          .join('')}
      </div>
    `
    }
  `;
}

function createScenario() {
  const s = { id: uid(), name: 'Nouveau scénario', steps: [] };
  state.scenarios.push(s);
  scheduleSave();
  openScenario(s.id);
}

function duplicateScenario(id) {
  const s = getScenario(id);
  const copy = JSON.parse(JSON.stringify(s));
  copy.id = uid();
  copy.name = s.name + ' (copie)';
  copy.steps.forEach((st) => (st.id = uid()));
  state.scenarios.push(copy);
  scheduleSave();
  render();
}

function openScenario(id) {
  activeScenarioId = id;
  view = 'scenario-detail';
  render();
}

function renderScenarioDetailView() {
  const s = getScenario(activeScenarioId);
  if (!s) {
    view = 'scenarios';
    return renderScenariosView();
  }
  return /* HTML */ `
    <div class="view-header">
      <div>
        <button
          class="btn-ghost btn btn-small"
          style="margin-bottom:10px;"
          onclick="goTo('scenarios')"
        >
          ← Tous les scénarios
        </button>
        <h2
          class="view-title"
          contenteditable="true"
          onblur="renameScenario('${s.id}', this.innerText)"
        >
          ${escapeHtml(s.name)}
        </h2>
        <p class="view-sub">
          ${s.steps.length} étape${s.steps.length > 1 ? 's' : ''} — clique sur le titre pour le
          renommer
        </p>
      </div>
      <button class="btn" onclick="openModal('step','${s.id}')">+ Ajouter une étape</button>
    </div>
    ${
      s.steps.length === 0
        ? emptyState('Aucune étape', 'Ajoute une première étape à ce scénario.')
        : `
      <div class="step-list">
        ${s.steps.map((st, idx) => renderStepCard(s, st, idx)).join('')}
      </div>
      ${renderScenarioAccommodations(s)}
    `
    }
  `;
}

function nightsByAccommodation(scenario) {
  const rows = new Map();
  scenario.steps.forEach((st) => {
    const nights = parseInt(st.nights) || 0;
    if (nights === 0) return;
    const key = st.accommodationId || '';
    rows.set(key, (rows.get(key) || 0) + nights);
  });
  return Array.from(rows, ([id, nights]) => ({
    acc: id ? getAccommodation(id) : null,
    nights,
  })).sort((a, b) => b.nights - a.nights);
}

function renderScenarioAccommodations(scenario) {
  const rows = nightsByAccommodation(scenario);
  if (rows.length === 0) return '';
  return /* HTML */ `
    <div class="acc-recap">
      <div class="acc-recap-title">
        Hébergements du scénario — ${nightsLabel(totalNights(scenario))}
      </div>
      ${rows
        .map(
          (r) => `
        <div class="acc-recap-row">
          <span>${r.acc ? `${accType(r.acc.type).emoji} ${escapeHtml(r.acc.name)} <span class="acc-recap-city">· ${escapeHtml(r.acc.city)}</span>` : '<span class="acc-recap-city">Sans hébergement</span>'}</span>
          <strong>${nightsLabel(r.nights)}</strong>
        </div>
      `,
        )
        .join('')}
    </div>
  `;
}

function renderStepCard(scenario, step, idx) {
  const acc = step.accommodationId ? getAccommodation(step.accommodationId) : null;
  return /* HTML */ `
    <div class="step-card">
      <div class="step-order">${idx + 1}</div>
      <div class="step-body">
        <div class="step-title">
          ${escapeHtml(step.city)}${step.region ? ` <span style="color:var(--ink-soft); font-weight:400;">· ${escapeHtml(step.region)}</span>` : ''}
        </div>
        <div class="step-detail">
          ${step.nights ? nightsLabel(step.nights) : 'passage'}
          ${step.arrivalDate ? ` · arrivée le ${escapeHtml(step.arrivalDate)}` : ''}
          ${step.notes ? ` · ${escapeHtml(step.notes)}` : ''}
        </div>
        <div class="step-acc">
          <select onchange="setStepAccommodation('${scenario.id}','${step.id}', this.value)">
            <option value="">— Aucun hébergement choisi —</option>
            ${state.accommodations.map((a) => `<option value="${a.id}" ${step.accommodationId === a.id ? 'selected' : ''}>${accType(a.type).emoji} ${escapeHtml(a.name)} (${escapeHtml(a.city)})</option>`).join('')}
          </select>
          ${acc ? `<span class="step-acc-nights">${accType(acc.type).emoji} ${escapeHtml(acc.name)} — ${nightsLabel(step.nights)}</span>` : ''}
        </div>
      </div>
      <div class="step-actions">
        <button
          class="icon-btn"
          onclick="moveStep('${scenario.id}','${step.id}',-1)"
          title="Monter"
        >
          ↑
        </button>
        <button
          class="icon-btn"
          onclick="moveStep('${scenario.id}','${step.id}',1)"
          title="Descendre"
        >
          ↓
        </button>
        <button
          class="icon-btn"
          onclick="openModal('step','${scenario.id}','${step.id}')"
          title="Modifier"
        >
          ✎
        </button>
        <button
          class="icon-btn"
          onclick="deleteStep('${scenario.id}','${step.id}')"
          title="Supprimer"
        >
          🗑
        </button>
      </div>
    </div>
  `;
}

function renameScenario(id, name) {
  const s = getScenario(id);
  s.name = name.trim() || s.name;
  scheduleSave();
}

function moveStep(scenarioId, stepId, dir) {
  const s = getScenario(scenarioId);
  const i = s.steps.findIndex((st) => st.id === stepId);
  const j = i + dir;
  if (j < 0 || j >= s.steps.length) return;
  [s.steps[i], s.steps[j]] = [s.steps[j], s.steps[i]];
  scheduleSave();
  render();
}

function deleteStep(scenarioId, stepId) {
  const s = getScenario(scenarioId);
  s.steps = s.steps.filter((st) => st.id !== stepId);
  scheduleSave();
  render();
}

function setStepAccommodation(scenarioId, stepId, accId) {
  const s = getScenario(scenarioId);
  const st = s.steps.find((x) => x.id === stepId);
  st.accommodationId = accId || null;
  scheduleSave();
}
