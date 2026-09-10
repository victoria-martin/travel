function getAccommodation(id){ return state.accommodations.find(a=>a.id===id); }
function getScenario(id){ return state.scenarios.find(s=>s.id===id); }

function distinctRegions(){
  const set = new Set();
  state.accommodations.forEach(a=>{ if(a.region) set.add(a.region); });
  return Array.from(set).sort();
}

function coordsFor(step){
  const acc = step.accommodationId ? getAccommodation(step.accommodationId) : null;
  if(acc && acc.lat && acc.lng) return [parseFloat(acc.lat), parseFloat(acc.lng)];
  if(CITY_PRESETS[step.city]) return CITY_PRESETS[step.city];
  return null;
}

function escapeHtml(str){
  if(str===undefined || str===null) return "";
  return String(str).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}
