const SIMPLE_CONFIG = {
  voitures: {
    dataKey: 'cars',
    title: 'Voitures',
    subtitle: 'Options de location',
    leadCell: defaultCarCell,
    fields: [
      { key: 'name', label: 'Loueur', type: 'text' },
      { key: 'model', label: 'Modèle', type: 'text' },
      { key: 'price', label: 'Prix', type: 'text' },
      { key: 'dates', label: 'Dates', type: 'text' },
      { key: 'location', label: 'Lieu de prise en charge', type: 'text' },
      { key: 'link', label: 'Lien', type: 'text', cell: linkCell },
      { key: 'notes', label: 'Notes', type: 'textarea' },
    ],
  },
  charges: {
    dataKey: 'fixedCosts',
    title: 'Charges fixes',
    subtitle: 'Péages, assurances, abonnements liés au voyage',
    fields: [
      { key: 'label', label: 'Libellé', type: 'text' },
      { key: 'amount', label: 'Montant', type: 'text' },
      { key: 'category', label: 'Catégorie', type: 'text' },
      { key: 'recurrence', label: 'Récurrence', type: 'text' },
      { key: 'notes', label: 'Notes', type: 'textarea' },
    ],
  },
};

function renderSimpleListView(kind) {
  const cfg = SIMPLE_CONFIG[kind];
  const items = state[cfg.dataKey];
  const mode = listViewMode[kind];
  return /* HTML */ `
    <div class="view-header">
      <div>
        <h2 class="view-title">${cfg.title}</h2>
        <p class="view-sub">
          ${cfg.subtitle} — ${items.length} enregistré${items.length > 1 ? 's' : ''}
        </p>
      </div>
      <div style="display:flex; gap:10px; align-items:center;">
        <div class="toggle-group">
          <button
            class="${mode === 'table' ? 'active' : ''}"
            onclick="setListMode('${kind}','table')"
          >
            Tableau
          </button>
          <button
            class="${mode === 'card' ? 'active' : ''}"
            onclick="setListMode('${kind}','card')"
          >
            Cartes
          </button>
        </div>
        <button class="btn" onclick="openModal('${kind}')">+ Ajouter</button>
      </div>
    </div>
    ${
      items.length === 0
        ? emptyState(
            `Aucune entrée`,
            `Ajoute ta première ligne dans « ${cfg.title.toLowerCase()} ».`,
          )
        : mode === 'table'
          ? simpleTable(kind, items)
          : simpleCards(kind, items)
    }
  `;
}

function simpleTable(kind, items) {
  const cfg = SIMPLE_CONFIG[kind];
  const cols = cfg.fields.filter((f) => f.type !== 'textarea');
  return /* HTML */ `<div class="table-wrap">
    <table>
      <thead>
        <tr>
          ${cfg.leadCell ? '<th></th>' : ''} ${cols.map((c) => `<th>${c.label}</th>`).join('')}
          <th></th>
        </tr>
      </thead>
      <tbody>
        ${items
          .map(
            (it) =>
              /* HTML */ ` <tr>
                ${cfg.leadCell ? `<td>${cfg.leadCell(it)}</td>` : ''}
                ${cols
                  .map(
                    (c, i) =>
                      `<td>${simpleCellContent(c, it)}${i === 0 ? `<div class="row-notes">${simpleNotesEditable(kind, it)}</div>` : ''}</td>`,
                  )
                  .join('')}
                <td style="white-space:nowrap;">
                  <button
                    class="icon-btn"
                    onclick="openModal('${kind}','${it.id}')"
                    title="Modifier"
                  >
                    ✎
                  </button>
                  <button
                    class="icon-btn"
                    onclick="deleteItem('${cfg.dataKey}','${it.id}')"
                    title="Supprimer"
                  >
                    🗑
                  </button>
                </td>
              </tr>`,
          )
          .join('')}
      </tbody>
    </table>
  </div>`;
}

function simpleCellContent(field, item) {
  return field.cell ? field.cell(item) : escapeHtml(item[field.key]) || '—';
}

function simpleCards(kind, items) {
  const cfg = SIMPLE_CONFIG[kind];
  const titleKey = cfg.fields[0].key;
  const metaFields = cfg.fields.slice(1).filter((f) => f.key !== 'notes' && f.key !== 'link');
  return /* HTML */ `<div class="card-grid">
    ${items
      .map(
        (it) =>
          /* HTML */ ` <div class="card">
            <div class="card-top">
              <p class="card-name">${escapeHtml(it[titleKey]) || 'Sans nom'}</p>
              ${cfg.leadCell ? cfg.leadCell(it) : ''}
            </div>
            <div class="card-meta">
              ${metaFields
                .map((f) => (it[f.key] ? `<span>${f.label} : ${escapeHtml(it[f.key])}</span>` : ''))
                .join('')}
              <span>📝 ${simpleNotesEditable(kind, it)}</span>
            </div>
            <div class="card-actions">
              <button class="btn-ghost btn btn-small" onclick="openModal('${kind}','${it.id}')">
                Modifier
              </button>
              <button
                class="btn-danger btn btn-small"
                onclick="deleteItem('${cfg.dataKey}','${it.id}')"
              >
                Suppr.
              </button>
              ${it.link ? linkButton(it.link, 'Lien') : ''}
            </div>
          </div>`,
      )
      .join('')}
  </div>`;
}
