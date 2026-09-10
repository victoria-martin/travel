function render(){
  const app = document.getElementById("app");
  app.innerHTML = `
    <div class="sidebar">
      <p class="brand">Voyage Toscane</p>
      <p class="brand-sub">Carnet de préparation</p>
      ${navBtn("hebergements","🏠","Hébergements")}
      ${navBtn("voitures","🚗","Voitures")}
      ${navBtn("charges","💶","Charges fixes")}
      ${navBtn("scenarios","🧭","Scénarios")}
      ${navBtn("carte","🗺️","Carte")}
      <div style="margin-top:14px; border-top:1px solid rgba(255,255,255,.12); padding-top:14px; display:flex; flex-direction:column; gap:6px;">
        <button class="nav-btn" onclick="exportDataJson()"><span class="nav-icon">📥</span>Exporter data.json</button>
        <button class="nav-btn" onclick="document.getElementById('json-file-input').click()"><span class="nav-icon">📤</span>Importer un data.json</button>
        <input type="file" id="json-file-input" accept="application/json" style="display:none;" onchange="importDataJsonFile(this)">
        <button class="nav-btn" onclick="resetToCommittedData()"><span class="nav-icon">↺</span>Revenir à data.json</button>
      </div>
      <div style="margin-top:14px; border-top:1px solid rgba(255,255,255,.12); padding-top:14px; display:flex; flex-direction:column; gap:6px;">
        ${syncStatusHtml()}
      </div>
    </div>
    <div class="main" id="main"></div>
  `;
  renderMain();
  if(modal) renderModal();
}

function navBtn(key, icon, label){
  const isActive = view===key || (key==="scenarios" && view==="scenario-detail");
  return `<button class="nav-btn ${isActive?'active':''}" onclick="goTo('${key}')">
    <span class="nav-icon">${icon}</span>${label}
  </button>`;
}

function goTo(v){
  view = v;
  if(v==="carte"){
    render();
    setTimeout(initMap, 30);
  } else {
    render();
  }
}

function renderMain(){
  const main = document.getElementById("main");
  if(view==="hebergements") main.innerHTML = renderAccommodationsView();
  else if(view==="voitures") main.innerHTML = renderSimpleListView("voitures");
  else if(view==="charges") main.innerHTML = renderSimpleListView("charges");
  else if(view==="scenarios") main.innerHTML = renderScenariosView();
  else if(view==="scenario-detail") main.innerHTML = renderScenarioDetailView();
  else if(view==="carte") main.innerHTML = renderMapView();
}
