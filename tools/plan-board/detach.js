// The board pops out into an ordinary browser window — movable, resizable, and free to go behind
// the others. The #app node is moved across documents, so state and listeners follow it: one
// instance, two possible homes.
const POPUP_FEATURES = 'popup=yes,width=520,height=880';
const WINDOW_NAME = 'plan-board';
const RESTORE_KEY = 'plan-board-detached';

let detached = null;
let keepOnUnload = false;

const isDetached = () => Boolean(detached && !detached.closed);

function copyHead(target) {
  const meta = target.document.createElement('meta');
  meta.setAttribute('charset', 'utf-8');
  target.document.head.append(meta);

  [...document.styleSheets].forEach((sheet) => {
    try {
      const style = target.document.createElement('style');
      style.textContent = [...sheet.cssRules].map((rule) => rule.cssText).join('\n');
      target.document.head.append(style);
    } catch {
      // A cross-origin sheet (the fonts) cannot be read: link it instead.
      const link = target.document.createElement('link');
      link.rel = 'stylesheet';
      link.href = sheet.href;
      target.document.head.append(link);
    }
  });
}

function reattach() {
  document.body.append(ui.getElementById('app'));
  setUiDocument(document);
  detached = null;
  renderBoard();
}

function adoptWindow(popup) {
  detached = popup;
  copyHead(popup);
  applyTheme(popup.document);
  popup.document.title = document.title;
  popup.document.body.style.margin = '0';
  popup.document.body.append(ui.getElementById('app'));
  setUiDocument(popup.document);
  renderBoard();

  popup.addEventListener('pagehide', reattach);
  window.addEventListener('pagehide', () => keepOnUnload || popup.close());
}

function detachWindow() {
  if (isDetached()) return detached.focus();

  const popup = window.open('about:blank', WINDOW_NAME, POPUP_FEATURES);
  if (!popup) return;
  adoptWindow(popup);
}

// A live reload would otherwise take the window down with the document that opened it. The window
// survives under its name, keeping the size and place it was given, and takes the fresh #app.
function keepDetachedThroughReload() {
  if (!isDetached()) return;
  keepOnUnload = true;
  sessionStorage.setItem(RESTORE_KEY, '1');
}

function restoreDetached() {
  if (!sessionStorage.getItem(RESTORE_KEY)) return;
  sessionStorage.removeItem(RESTORE_KEY);

  const popup = window.open('', WINDOW_NAME);
  if (!popup) return;
  popup.document.head.innerHTML = '';
  popup.document.body.innerHTML = '';
  adoptWindow(popup);
}
