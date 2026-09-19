/*
  Sous 640px, la barre du bas ne garde que les MOBILE_NAV_PRIMARY_COUNT premières pages de l'ordre
  choisi ; le reste va dans le tiroir Plus. L'ordre est une préférence locale (js/prefs.js), jamais
  synchronisée — chacun réorganise sa propre barre.
*/
const MOBILE_NAV_PRIMARY_COUNT = 4;

// Réconcilie l'ordre enregistré avec NAV_ITEMS : une page retirée du code disparaît, une page
// ajoutée depuis atterrit en fin de tiroir plutôt que de casser la préférence stockée.
function mobileNavOrder() {
  const known = NAV_ITEMS.map((item) => item.key);
  const stored = (prefs.mobileNavOrder || []).filter((key) => known.includes(key));
  const missing = known.filter((key) => !stored.includes(key));
  return [...stored, ...missing];
}

function mobileNavPrimaryKeys() {
  return mobileNavOrder().slice(0, MOBILE_NAV_PRIMARY_COUNT);
}

function mobileNavSecondaryKeys() {
  return mobileNavOrder().slice(MOBILE_NAV_PRIMARY_COUNT);
}

function persistMobileNavOrder(order) {
  prefs.mobileNavOrder = order;
  persistPrefs();
}

function moveMobileNavItemBefore(draggedKey, targetKey, before) {
  if (draggedKey === targetKey) return;
  const order = mobileNavOrder().filter((key) => key !== draggedKey);
  const targetIndex = order.indexOf(targetKey);
  order.splice(before ? targetIndex : targetIndex + 1, 0, draggedKey);
  persistMobileNavOrder(order);
  render();
}

let mobileNavPlusOpen = false;
let mobileNavReordering = false;

function toggleMobileNavPlus() {
  mobileNavPlusOpen = !mobileNavPlusOpen;
  mobileNavReordering = false;
  render();
}

function closeMobileNavPlus() {
  mobileNavPlusOpen = false;
  mobileNavReordering = false;
  render();
}

function startMobileNavReorder() {
  mobileNavReordering = true;
  render();
}

function endMobileNavReorder() {
  mobileNavReordering = false;
  render();
}

// Le tiroir se referme avant la navigation plutôt qu'après, pour ne pas déclencher deux rendus.
function goToFromMobileNav(key) {
  mobileNavPlusOpen = false;
  mobileNavReordering = false;
  goTo(key);
}
