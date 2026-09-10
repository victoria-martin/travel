loadSyncConfig();
loadData();
initSync();

function pullIfIdle() {
  if (syncActive() && !modal && !document.hidden) pullFromSheet({ silent: true });
}

document.addEventListener('visibilitychange', pullIfIdle);
window.addEventListener('focus', pullIfIdle);
