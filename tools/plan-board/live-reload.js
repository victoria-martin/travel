// Saving a board file refreshes the open board. Two things can happen — a front file changes and
// the server pushes, or a server file changes and node restarts, dropping this stream. The browser
// reconnects on its own, so a reopened stream carries the same meaning as a push.
let streamOpened = false;
let reloadQueued = false;

function reloadBoard() {
  keepDetachedThroughReload();
  location.reload();
}

// An open drawer usually holds something half-typed: hold the reload until it closes.
function requestReload() {
  if (drawerMode) reloadQueued = true;
  else reloadBoard();
}

function runQueuedReload() {
  if (reloadQueued) reloadBoard();
}

const reloadStream = new EventSource('/api/reload');
reloadStream.addEventListener('message', requestReload);
reloadStream.addEventListener('open', () => {
  if (streamOpened) requestReload();
  streamOpened = true;
});
