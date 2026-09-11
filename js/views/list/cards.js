function listCards(kind, items) {
  const cfg = LIST_CONFIG[kind];
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
              <span>📝 ${listNotesEditable(kind, it)}</span>
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
