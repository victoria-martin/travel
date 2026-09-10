/*
  Le Google Sheet (via l'Apps Script de apps-script/Code.gs) devient la source de vérité
  partagée. localStorage reste le cache local : l'app marche hors ligne, et tout ce qui
  a été modifié pendant la coupure est renvoyé au Sheet à la reconnexion.
  `sync.base` = dernier état reçu du Sheet, ce qui permet de fusionner entrée par entrée
  au lieu d'écraser le travail de l'autre.
*/

const SYNC_URL_KEY = "voyage-toscane-sync-url";
const SYNC_BASE_KEY = "voyage-toscane-sync-base";
const POLL_MS = 5000;
const PUSH_DEBOUNCE_MS = 900;

let sync = {
  url: "",
  rev: null,
  base: null,
  status: "off", // off | pulling | pushing | ok | error | choice
  message: "",
  pushTimer: null,
  pollTimer: null,
  busy: false,
  dirty: false,
  pendingRemote: null,
};

function syncActive(){ return !!sync.url; }

function loadSyncConfig(){
  try{
    sync.url = localStorage.getItem(SYNC_URL_KEY) || "";
    const raw = localStorage.getItem(SYNC_BASE_KEY);
    if(raw){
      const parsed = JSON.parse(raw);
      sync.base = parsed.data || null;
      sync.rev = parsed.rev || null;
    }
  }catch(e){ /* config illisible : on repart sans synchro */ }
}

function saveSyncBase(rev, data){
  sync.rev = rev;
  sync.base = deepClone(data);
  try{ localStorage.setItem(SYNC_BASE_KEY, JSON.stringify({rev, data})); }catch(e){}
}

function clearSyncBase(){
  sync.rev = null;
  sync.base = null;
  try{ localStorage.removeItem(SYNC_BASE_KEY); }catch(e){}
}

function setSyncStatus(status, message){
  sync.status = status;
  sync.message = message || "";
  const el = document.getElementById('sync-status');
  if(el) el.outerHTML = syncStatusHtml();
}

function syncStatusHtml(){
  const labels = {
    off: ["⚪", "Local seulement"],
    pulling: ["🔄", "Lecture du Sheet…"],
    pushing: ["🔄", "Envoi au Sheet…"],
    ok: ["🟢", "Sheet synchronisé"],
    choice: ["🟠", "Choix à faire"],
    error: ["🔴", sync.message || "Sheet injoignable"],
  };
  const [icon, label] = labels[sync.status] || labels.off;
  return `<button class="nav-btn" id="sync-status" onclick="openSyncModal()" title="${escapeHtml(sync.message)}">
    <span class="nav-icon">${icon}</span>${escapeHtml(label)}
  </button>`;
}

function deepClone(value){ return JSON.parse(JSON.stringify(value)); }
function sameJson(a, b){ return JSON.stringify(a) === JSON.stringify(b); }

/* ------------------------------ appels réseau ------------------------------ */

async function sheetGet(){
  const res = await fetch(sync.url, {method:'GET', redirect:'follow'});
  if(!res.ok) throw new Error('HTTP ' + res.status);
  return parseSheetResponse(await res.text());
}

async function sheetPost(payload){
  // Content-Type text/plain : évite la requête OPTIONS de préflight, qu'Apps Script ne gère pas.
  const res = await fetch(sync.url, {
    method: 'POST',
    redirect: 'follow',
    headers: {'Content-Type': 'text/plain;charset=utf-8'},
    body: JSON.stringify(payload),
  });
  if(!res.ok) throw new Error('HTTP ' + res.status);
  return parseSheetResponse(await res.text());
}

function parseSheetResponse(text){
  let payload;
  try{
    payload = JSON.parse(text);
  }catch(e){
    throw new Error("Réponse inattendue : vérifie que l'URL finit par /exec et que l'accès est « tout le monde »");
  }
  if(payload.error) throw new Error(payload.error);
  return payload;
}

/* ------------------------------ fusion 3 voies ------------------------------ */

function mergeCollections(remote, local, base, mergeItem){
  const index = arr => new Map((arr||[]).map(x=>[x.id, x]));
  const localById = index(local), baseById = index(base);
  const out = [];
  const taken = new Set();

  (remote||[]).forEach(r=>{
    const l = localById.get(r.id);
    const b = baseById.get(r.id);
    if(!l){
      if(b) return;            // supprimé ici depuis le dernier sync
      out.push(r);             // ajouté là-bas
      taken.add(r.id);
      return;
    }
    const localChanged = !b || !sameJson(l, b);
    out.push(mergeItem ? mergeItem(r, l, b, localChanged) : (localChanged ? l : r));
    taken.add(r.id);
  });

  (local||[]).forEach(l=>{
    if(taken.has(l.id)) return;
    if(baseById.has(l.id)) return; // supprimé là-bas
    out.push(l);                   // ajouté ici
  });

  return out;
}

function withoutSteps(scenario){
  const {steps, ...rest} = scenario || {};
  return rest;
}

// Le nom du scénario et ses étapes se fusionnent séparément : toucher une étape
// ne doit pas écraser un renommage venu du Sheet.
function mergeScenario(remoteScenario, localScenario, baseScenario){
  const ownFieldsChanged = !baseScenario || !sameJson(withoutSteps(localScenario), withoutSteps(baseScenario));
  const merged = deepClone(ownFieldsChanged ? withoutSteps(localScenario) : withoutSteps(remoteScenario));
  merged.steps = mergeCollections(remoteScenario.steps || [], localScenario.steps || [], (baseScenario && baseScenario.steps) || []);
  return merged;
}

function mergeStates(remote, local, base){
  base = base || {};
  const importsDone = {...(remote.importsDone||{})};
  Object.keys(local.importsDone||{}).forEach(k=>{ if(local.importsDone[k]) importsDone[k] = true; });
  return {
    accommodations: mergeCollections(remote.accommodations, local.accommodations, base.accommodations),
    cars: mergeCollections(remote.cars, local.cars, base.cars),
    fixedCosts: mergeCollections(remote.fixedCosts, local.fixedCosts, base.fixedCosts),
    scenarios: mergeCollections(remote.scenarios, local.scenarios, base.scenarios, mergeScenario),
    importsDone,
  };
}

function isEmptyState(data){
  if(!data) return true;
  return ['accommodations','cars','fixedCosts','scenarios'].every(k => !(data[k]||[]).length);
}

/* ------------------------------ pull / push ------------------------------ */

async function pullFromSheet({silent = false} = {}){
  if(!syncActive() || sync.busy) return;
  sync.busy = true;
  if(!silent) setSyncStatus('pulling');
  try{
    const {rev, data} = await sheetGet();
    if(rev === sync.rev){
      setSyncStatus('ok');
      return;
    }
    applyRemote(rev, data);
  }catch(e){
    setSyncStatus('error', e.message);
  }finally{
    sync.busy = false;
  }
}

function applyRemote(rev, data){
  const merged = sync.base ? mergeStates(data, state, sync.base) : data;
  const needsPush = !sameJson(merged, data);
  state = merged;
  persist();
  saveSyncBase(rev, data);
  setSyncStatus('ok');
  if(!modal) render();
  if(needsPush) schedulePush();
}

function schedulePush(){
  if(!syncActive()) return;
  sync.dirty = true;
  clearTimeout(sync.pushTimer);
  sync.pushTimer = setTimeout(pushToSheet, PUSH_DEBOUNCE_MS);
}

async function pushToSheet(){
  if(!syncActive() || sync.busy) {
    if(syncActive()) schedulePush();
    return;
  }
  sync.busy = true;
  setSyncStatus('pushing');
  try{
    let payload = await sheetPost({action:'push', baseRev: sync.rev, data: state});
    if(payload.conflict){
      // Le Sheet a bougé : on fusionne entrée par entrée, puis on renvoie.
      state = mergeStates(payload.data, state, sync.base);
      persist();
      saveSyncBase(payload.rev, payload.data);
      if(!modal) render();
      payload = await sheetPost({action:'push', baseRev: sync.rev, data: state});
      if(payload.conflict) throw new Error("Le Sheet change en même temps, nouvelle tentative dans un instant");
    }
    state = payload.data;
    persist();
    saveSyncBase(payload.rev, payload.data);
    sync.dirty = false;
    setSyncStatus('ok');
    if(!modal) render();
  }catch(e){
    setSyncStatus('error', e.message);
    sync.pushTimer = setTimeout(pushToSheet, 15000);
  }finally{
    sync.busy = false;
  }
}

function startPolling(){
  clearInterval(sync.pollTimer);
  if(!syncActive()) return;
  sync.pollTimer = setInterval(()=>{
    if(document.hidden || modal || sync.dirty) return;
    pullFromSheet({silent:true});
  }, POLL_MS);
}

async function initSync(){
  if(!syncActive()){ setSyncStatus('off'); return; }
  setSyncStatus('pulling');
  try{
    const {rev, data} = await sheetGet();
    if(isEmptyState(data) && !isEmptyState(state)){
      // Sheet vierge : on l'amorce avec ce qu'on a en local.
      saveSyncBase(rev, data);
      await pushToSheet();
    }else if(!sync.base && !isEmptyState(state) && !sameJson(state, data)){
      // Première connexion avec des données des deux côtés : à elle de trancher.
      sync.pendingRemote = {rev, data};
      setSyncStatus('choice', "Données locales et Sheet différents");
      openSyncModal();
    }else{
      applyRemote(rev, data);
    }
  }catch(e){
    setSyncStatus('error', e.message);
  }
  startPolling();
}

/* ------------------------------ réglages ------------------------------ */

function openSyncModal(){
  modal = {type:'sync', payload:{}};
  render();
}

function syncForm(){
  const choice = sync.status === 'choice' && sync.pendingRemote;
  return `
    <h3>Synchro Google Sheets</h3>
    <p style="font-size:13px; color:var(--ink-soft); margin-top:-8px;">
      Colle l'URL de ton application web Apps Script (celle qui finit par <strong>/exec</strong>).
      Voir <strong>apps-script/Code.gs</strong> et le README pour la mise en place.
    </p>
    <div class="field">
      <label>URL de l'application web</label>
      <input id="sync-url" type="text" value="${escapeHtml(sync.url)}" placeholder="https://script.google.com/macros/s/.../exec">
    </div>
    <p style="font-size:12.5px; color:var(--ink-soft);">
      État : ${escapeHtml(sync.message || sync.status)}
    </p>
    ${choice ? `
      <div style="border-top:1px solid var(--line); padding-top:12px; margin-top:4px;">
        <p style="font-size:13px;"><strong>Tes données locales et celles du Sheet diffèrent.</strong> Que garde-t-on comme point de départ ?</p>
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          <button class="btn" onclick="resolveSyncChoice('remote')">Prendre le Sheet</button>
          <button class="btn btn-ghost" onclick="resolveSyncChoice('local')">Envoyer mes données locales</button>
        </div>
      </div>` : ''}
    <div class="modal-actions">
      ${syncActive() ? `<button class="btn btn-danger" onclick="disconnectSync()">Déconnecter</button>` : ''}
      <button class="btn btn-ghost" onclick="closeModal()">Fermer</button>
      <button class="btn" onclick="saveSyncUrl()">Connecter</button>
    </div>
  `;
}

function saveSyncUrl(){
  const url = document.getElementById('sync-url').value.trim();
  if(url && !/^https:\/\/script\.google\.com\/.*\/exec$/.test(url)){
    if(!confirm("Cette URL ne ressemble pas à une application web Apps Script (/exec). Continuer quand même ?")) return;
  }
  const changed = url !== sync.url;
  sync.url = url;
  try{
    if(url) localStorage.setItem(SYNC_URL_KEY, url);
    else localStorage.removeItem(SYNC_URL_KEY);
  }catch(e){}
  if(changed) clearSyncBase();
  sync.pendingRemote = null;
  closeModal();
  initSync();
}

function resolveSyncChoice(side){
  const pending = sync.pendingRemote;
  if(!pending) return;
  sync.pendingRemote = null;
  closeModal();
  if(side === 'remote'){
    clearSyncBase();
    applyRemote(pending.rev, pending.data);
  }else{
    // base = état du Sheet : tout ce qui diffère en local gagne, le reste du Sheet est retiré.
    saveSyncBase(pending.rev, pending.data);
    schedulePush();
  }
  startPolling();
}

function disconnectSync(){
  if(!confirm("Arrêter la synchro avec le Sheet ? Tes données restent dans ce navigateur.")) return;
  clearInterval(sync.pollTimer);
  clearTimeout(sync.pushTimer);
  sync.url = "";
  sync.pendingRemote = null;
  try{ localStorage.removeItem(SYNC_URL_KEY); }catch(e){}
  clearSyncBase();
  setSyncStatus('off');
  closeModal();
}
