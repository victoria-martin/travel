function stepCard(scenario, step, idx) {
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
