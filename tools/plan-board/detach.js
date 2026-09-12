// The board pops out into an ordinary browser window — movable, resizable, and free to go behind
// the others. The #app node is moved across documents, so state and listeners follow it: one
// instance, two possible homes.
const POPUP_FEATURES = 'popup=yes,width=520,height=880';

let detached = null;

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

function detachWindow() {
  if (detached && !detached.closed) return detached.focus();

  const popup = window.open('about:blank', 'plan-board', POPUP_FEATURES);
  if (!popup) return;

  detached = popup;
  copyHead(popup);
  applyTheme(popup.document);
  popup.document.title = document.title;
  popup.document.body.style.margin = '0';
  popup.document.body.append(ui.getElementById('app'));
  setUiDocument(popup.document);
  renderBoard();

  popup.addEventListener('pagehide', reattach);
  window.addEventListener('pagehide', () => popup.close());
}
