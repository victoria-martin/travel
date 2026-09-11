// Une étape sans lieu géolocalisé est absente du tracé : la pastille le dit sur place.
function stepOrderBadge(step, idx) {
  if (coordsFor(step)) return `<div class="step-order">${stepLetter(idx)}</div>`;
  return /* HTML */ `<div class="step-order step-order-unmapped" title="Pas de lieu géolocalisé — absente de la carte">
    ${stepLetter(idx)}
  </div>`;
}

function stepCard(scenario, step, idx) {
  return /* HTML */ `
    <div class="step-card">
      ${stepOrderBadge(step, idx)}
      <div class="step-body">
        <div class="step-title">
          ${editableText(step.city, `renameStep('${scenario.id}','${step.id}', this.innerText)`, {
            key: `step:${step.id}:city`,
            placeholder: 'ville…',
          })}${step.region ? ` <span style="color:var(--ink-soft); font-weight:400;">· ${escapeHtml(step.region)}</span>` : ''}
        </div>
        ${stepDetailLine(scenario, step, idx)}
        <div class="step-acc">
          <select onchange="setStepPlace('${scenario.id}','${step.id}', this.value)">
            <option value="">— Aucun lieu choisi —</option>
            ${stepPlaceOptions(step)}
          </select>
          <select onchange="setStepNights('${scenario.id}','${step.id}', this.value)">
            ${NIGHTS_OPTIONS.map((n) => `<option value="${n}" ${(parseInt(step.nights) || 0) === n ? 'selected' : ''}>${nightsLabel(n)}</option>`).join('')}
          </select>
          ${stepBudgetSlot(scenario, step)}
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

// Le budget est éditable sur la ligne ; sans budget, on montre le total calculé de l'hébergement.
function stepBudgetSlot(scenario, step) {
  const acc = getAccommodation(step.accommodationId);
  const auto = accommodationCost(step);
  return /* HTML */ `<span class="step-total">
    ${
      !hasStepBudget(step) && auto
        ? `<span class="step-total-auto">${formatAccommodationCost(acc, auto)}</span>`
        : ''
    }
    <span class="step-budget"
      >${editableText(step.budget, `setStepBudget('${scenario.id}','${step.id}', this.innerText)`, {
        key: `step:${step.id}:budget`,
        placeholder: 'budget…',
      })}${hasStepBudget(step) ? ' €' : ''}</span
    >
  </span>`;
}

function stepDetailLine(scenario, step, idx) {
  const parts = [
    stepDateRange(scenario, idx),
    step.arrivalDate ? `arrivée le ${escapeHtml(step.arrivalDate)}` : '',
    step.notes ? escapeHtml(step.notes) : '',
  ].filter(Boolean);
  if (parts.length === 0) return '';
  return `<div class="step-detail">${parts.join(' · ')}</div>`;
}
