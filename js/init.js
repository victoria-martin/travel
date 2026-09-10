loadSyncConfig();
loadData();
initSync();
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && syncActive() && !modal) pullFromSheet({ silent: true });
});
