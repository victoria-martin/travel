function renderAccommodationsView(){
  const mode = listViewMode.hebergements;
  let items = [...state.accommodations].sort((a,b)=> (b.favorite?1:0) - (a.favorite?1:0));
  const favOnly = !!listFilters.favOnly;
  if(favOnly) items = items.filter(a=>a.favorite);
  return `
    <div class="view-header">
      <div>
        <h2 class="view-title">Hébergements</h2>
        <p class="view-sub">${Object.values(ACCOMMODATION_TYPES).map(t=>t.label).join(' · ')} — ${items.length} enregistré${items.length>1?'s':''}</p>
      </div>
      <div style="display:flex; gap:10px; align-items:center;">
        ${(!state.importsDone || !state.importsDone.batch1) ? `<button class="btn-ghost btn" onclick="applyImportBatch1()">⬆ Importer mes recherches (12 hébergements + 1 voiture)</button>` : ''}
        <button class="btn-ghost btn" onclick="openPasteImport()">📋 Importer depuis un tableau</button>
        <label class="filter-option" style="padding:0;"><input type="checkbox" ${favOnly?'checked':''} onchange="toggleFavOnly()"> ⭐ Favoris uniquement</label>
        <div class="toggle-group">
          <button class="${mode==='table'?'active':''}" onclick="setListMode('hebergements','table')">Tableau</button>
          <button class="${mode==='card'?'active':''}" onclick="setListMode('hebergements','card')">Cartes</button>
        </div>
        <button class="btn" onclick="openModal('accommodation')">+ Ajouter</button>
      </div>
    </div>
    ${items.length===0 ? emptyState("Aucun hébergement", favOnly ? "Aucun favori pour l'instant — clique sur l'étoile d'un hébergement pour le marquer." : "Ajoute tes premiers hébergements pour pouvoir les rattacher à tes étapes.") :
      (mode==='table' ? accommodationTable(items) : accommodationCards(items))}
  `;
}

function toggleFavOnly(){
  listFilters.favOnly = !listFilters.favOnly;
  render();
}

function toggleFavorite(id){
  const a = getAccommodation(id);
  a.favorite = !a.favorite;
  scheduleSave();
  render();
}

function accommodationTable(items){
  return `<div class="table-wrap"><table>
    <thead><tr><th>Nom</th><th>Type</th><th>Ville / Région</th><th>Prix</th><th>Dates</th><th>Lien</th><th></th></tr></thead>
    <tbody>
      ${items.map(a=>`
        <tr>
          <td>
            <button class="icon-btn" style="border:none; font-size:15px; color:${a.favorite?'#C98A3E':'var(--line)'};" onclick="toggleFavorite('${a.id}')" title="${a.favorite?'Retirer des favoris':'Ajouter aux favoris'}">${a.favorite?'★':'☆'}</button>
            <strong>${escapeHtml(a.name)}</strong>${a.notes?`<div style="color:var(--ink-soft); font-size:12px; margin-top:2px; margin-left:26px;">${escapeHtml(a.notes)}</div>`:''}</td>
          <td><span class="tag ${accType(a.type).tagClass}">${accType(a.type).label}</span></td>
          <td>${escapeHtml(a.city)}${a.region?` · ${escapeHtml(a.region)}`:''}</td>
          <td>${a.price?escapeHtml(a.price)+' €':'—'}</td>
          <td>${escapeHtml(a.dates)||'—'}</td>
          <td>${a.link?`<a href="${escapeHtml(a.link)}" target="_blank" style="color:var(--stone-dark);">Voir</a>`:'—'}</td>
          <td style="white-space:nowrap;">
            <button class="icon-btn" onclick="openModal('accommodation','${a.id}')" title="Modifier">✎</button>
            <button class="icon-btn" onclick="deleteItem('accommodations','${a.id}')" title="Supprimer">🗑</button>
          </td>
        </tr>`).join('')}
    </tbody>
  </table></div>`;
}

function accommodationCards(items){
  return `<div class="card-grid">
    ${items.map(a=>`
      <div class="card">
        <div class="card-top">
          <p class="card-name">${escapeHtml(a.name)}</p>
          <div style="display:flex; gap:6px; align-items:center; flex-shrink:0;">
            <span class="tag ${accType(a.type).tagClass}">${accType(a.type).short}</span>
            <button class="icon-btn" style="border:none; font-size:16px; color:${a.favorite?'#C98A3E':'var(--line)'};" onclick="toggleFavorite('${a.id}')" title="${a.favorite?'Retirer des favoris':'Ajouter aux favoris'}">${a.favorite?'★':'☆'}</button>
          </div>
        </div>
        <div class="card-meta">
          <span>📍 ${escapeHtml(a.city)}${a.region?` · ${escapeHtml(a.region)}`:''}</span>
          ${a.price?`<span>💶 ${escapeHtml(a.price)} €</span>`:''}
          ${a.dates?`<span>📅 ${escapeHtml(a.dates)}</span>`:''}
          ${a.notes?`<span>📝 ${escapeHtml(a.notes)}</span>`:''}
        </div>
        <div class="card-actions">
          <button class="btn-ghost btn btn-small" onclick="openModal('accommodation','${a.id}')">Modifier</button>
          <button class="btn-danger btn btn-small" onclick="deleteItem('accommodations','${a.id}')">Suppr.</button>
          ${a.link?`<a href="${escapeHtml(a.link)}" target="_blank" class="btn-ghost btn btn-small" style="text-decoration:none;">Lien</a>`:''}
        </div>
      </div>`).join('')}
  </div>`;
}
