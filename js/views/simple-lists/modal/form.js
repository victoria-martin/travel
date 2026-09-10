function emptySimple(kind) {
  const empty = { id: null };
  SIMPLE_CONFIG[kind].fields.forEach((f) => (empty[f.key] = ''));
  return empty;
}

function simpleForm(kind, p) {
  const cfg = SIMPLE_CONFIG[kind];
  return /* HTML */ `
    <h3>${p.id ? 'Modifier' : 'Ajouter'} — ${cfg.title}</h3>
    ${cfg.fields
      .map((f) =>
        f.type === 'textarea'
          ? `<div class="field"><label>${f.label}</label><textarea id="f-${f.key}" rows="2">${escapeHtml(p[f.key])}</textarea></div>`
          : `<div class="field"><label>${f.label}</label><input id="f-${f.key}" type="text" value="${escapeHtml(p[f.key])}"></div>`,
      )
      .join('')}
    <div class="modal-actions">
      <button class="btn btn-ghost" onclick="closeModal()">Annuler</button>
      <button class="btn" onclick="saveSimple('${kind}','${p.id || ''}')">Enregistrer</button>
    </div>
  `;
}
