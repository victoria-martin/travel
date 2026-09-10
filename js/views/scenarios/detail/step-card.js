function stepCard(scenario, step, idx) {
  return /* HTML */ `
    <div class="step-card">
      <div class="step-order">${idx + 1}</div>
      <div class="step-body">
        <div class="step-title">
          ${editableText(step.city, `renameStep('${scenario.id}','${step.id}', this.innerText)`, {
            key: `step:${step.id}:city`,
            placeholder: 'ville…',
          })}${step.region ? ` <span style="color:var(--ink-soft); font-weight:400;">· ${escapeHtml(step.region)}</span>` : ''}
        </div>
        ${stepDetailLine(step)}
        <div class="step-acc">
          <select onchange="setStepPlace('${scenario.id}','${step.id}', this.value)">
            <option value="">— Aucun lieu choisi —</option>
            ${stepPlaceOptions(step)}
          </select>
          <select onchange="setStepNights('${scenario.id}','${step.id}', this.value)">
            ${NIGHTS_OPTIONS.map((n) => `<option value="${n}" ${(parseInt(step.nights) || 0) === n ? 'selected' : ''}>${nightsLabel(n)}</option>`).join('')}
          </select>
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

function stepDetailLine(step) {
  const parts = [
    step.arrivalDate ? `arrivée le ${escapeHtml(step.arrivalDate)}` : '',
    step.notes ? escapeHtml(step.notes) : '',
  ].filter(Boolean);
  if (parts.length === 0) return '';
  return `<div class="step-detail">${parts.join(' · ')}</div>`;
}
