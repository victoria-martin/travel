const SIMPLE_CONFIG = {
  voitures: {
    dataKey: "cars",
    title: "Voitures",
    subtitle: "Options de location",
    fields: [
      {key:"name", label:"Loueur / modèle", type:"text"},
      {key:"price", label:"Prix", type:"text"},
      {key:"dates", label:"Dates", type:"text"},
      {key:"location", label:"Lieu de prise en charge", type:"text"},
      {key:"notes", label:"Notes", type:"textarea"},
    ]
  },
  charges: {
    dataKey: "fixedCosts",
    title: "Charges fixes",
    subtitle: "Péages, assurances, abonnements liés au voyage",
    fields: [
      {key:"label", label:"Libellé", type:"text"},
      {key:"amount", label:"Montant", type:"text"},
      {key:"category", label:"Catégorie", type:"text"},
      {key:"recurrence", label:"Récurrence", type:"text"},
      {key:"notes", label:"Notes", type:"textarea"},
    ]
  }
};

function renderSimpleListView(kind){
  const cfg = SIMPLE_CONFIG[kind];
  const items = state[cfg.dataKey];
  const mode = listViewMode[kind];
  return `
    <div class="view-header">
      <div>
        <h2 class="view-title">${cfg.title}</h2>
        <p class="view-sub">${cfg.subtitle} — ${items.length} enregistré${items.length>1?'s':''}</p>
      </div>
      <div style="display:flex; gap:10px; align-items:center;">
        <div class="toggle-group">
          <button class="${mode==='table'?'active':''}" onclick="setListMode('${kind}','table')">Tableau</button>
          <button class="${mode==='card'?'active':''}" onclick="setListMode('${kind}','card')">Cartes</button>
        </div>
        <button class="btn" onclick="openModal('${kind}')">+ Ajouter</button>
      </div>
    </div>
    ${items.length===0 ? emptyState(`Aucune entrée`, `Ajoute ta première ligne dans « ${cfg.title.toLowerCase()} ».`) :
      (mode==='table' ? simpleTable(kind, items) : simpleCards(kind, items))}
  `;
}

function simpleTable(kind, items){
  const cfg = SIMPLE_CONFIG[kind];
  const cols = cfg.fields.filter(f=>f.type!=="textarea");
  return `<div class="table-wrap"><table>
    <thead><tr>${cols.map(c=>`<th>${c.label}</th>`).join('')}<th></th></tr></thead>
    <tbody>
      ${items.map(it=>`
        <tr>
          ${cols.map(c=>`<td>${escapeHtml(it[c.key])||'—'}</td>`).join('')}
          <td style="white-space:nowrap;">
            <button class="icon-btn" onclick="openModal('${kind}','${it.id}')" title="Modifier">✎</button>
            <button class="icon-btn" onclick="deleteItem('${cfg.dataKey}','${it.id}')" title="Supprimer">🗑</button>
          </td>
        </tr>`).join('')}
    </tbody>
  </table></div>`;
}

function simpleCards(kind, items){
  const cfg = SIMPLE_CONFIG[kind];
  const titleKey = cfg.fields[0].key;
  return `<div class="card-grid">
    ${items.map(it=>`
      <div class="card">
        <p class="card-name">${escapeHtml(it[titleKey])||'Sans nom'}</p>
        <div class="card-meta">
          ${cfg.fields.slice(1).map(f=> it[f.key] ? `<span>${f.label} : ${escapeHtml(it[f.key])}</span>` : '').join('')}
        </div>
        <div class="card-actions">
          <button class="btn-ghost btn btn-small" onclick="openModal('${kind}','${it.id}')">Modifier</button>
          <button class="btn-danger btn btn-small" onclick="deleteItem('${cfg.dataKey}','${it.id}')">Suppr.</button>
        </div>
      </div>`).join('')}
  </div>`;
}
