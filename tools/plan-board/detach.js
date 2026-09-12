// The board pops out into a floating always-on-top window, like Meet's.
// The #app node is moved across documents, so state and listeners follow it.
const PIP_SIZE = { width: 460, height: 720 };

const canDetach = () => 'documentPictureInPicture' in window;

function copyStyles(target) {
  [...document.styleSheets].forEach((sheet) => {
    try {
      const style = document.createElement('style');
      style.textContent = [...sheet.cssRules].map((rule) => rule.cssText).join('\n');
      target.document.head.append(style);
    } catch {
      // A cross-origin sheet (the fonts) cannot be read: link it instead.
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = sheet.href;
      target.document.head.append(link);
    }
  });
}

async function detachWindow() {
  if (!canDetach()) return;
  const app = ui.getElementById('app');
  const floating = await documentPictureInPicture.requestWindow(PIP_SIZE);

  copyStyles(floating);
  floating.document.title = document.title;
  floating.document.body.append(app);
  setUiDocument(floating.document);

  floating.addEventListener('pagehide', () => {
    document.body.append(app);
    setUiDocument(document);
  });
}
