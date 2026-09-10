/*
  Source de vérité "committée" : data.json (dans le repo, à côté de index.html).
  Modifs en cours : sauvegardées automatiquement dans le navigateur (localStorage) —
  visibles uniquement sur cet ordinateur/navigateur, tant que tu n'as pas exporté
  et recommité data.json dans le repo.
*/

async function loadData(){
  const local = readLocalStorage();
  if(local){
    state = local;
    render();
    return;
  }
  try{
    const res = await fetch('data.json', {cache:'no-store'});
    if(!res.ok) throw new Error('data.json introuvable');
    state = await res.json();
  }catch(e){
    console.warn("Impossible de charger data.json, utilisation des données par défaut.", e);
    state = defaultData();
  }
  render();
}

function readLocalStorage(){
  try{
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? JSON.parse(raw) : null;
  }catch(e){ return null; }
}

function scheduleSave(){
  clearTimeout(saveTimer);
  saveTimer = setTimeout(()=>{ persist(); schedulePush(); }, 300);
}

function persist(){
  try{
    localStorage.setItem(LOCAL_KEY, JSON.stringify(state));
  }catch(e){
    console.error("Erreur de sauvegarde locale", e);
  }
}

function exportDataJson(){
  const blob = new Blob([JSON.stringify(state, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'data.json';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importDataJsonFile(input){
  const file = input.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = (e)=>{
    try{
      const parsed = JSON.parse(e.target.result);
      state = parsed;
      persist();
      render();
      alert("Données importées depuis le fichier.");
    }catch(err){
      alert("Ce fichier n'est pas un JSON valide.");
    }
  };
  reader.readAsText(file);
  input.value = '';
}

function resetToCommittedData(){
  if(!confirm("Repartir de data.json effacera tes modifications locales non exportées. Continuer ?")) return;
  localStorage.removeItem(LOCAL_KEY);
  loadData();
}
