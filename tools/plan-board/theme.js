// Two skins: the paper one that matches the travel app, and a dark one to work in.
const THEME_KEY = 'plan-board-theme';

const systemTheme = () =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dev' : 'paper';

let theme = (() => {
  try {
    return localStorage.getItem(THEME_KEY) || systemTheme();
  } catch {
    return systemTheme();
  }
})();

function applyTheme(target) {
  target.documentElement.dataset.theme = theme;
}

function toggleTheme() {
  theme = theme === 'dev' ? 'paper' : 'dev';
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // A blocked store only costs the preference.
  }
  applyTheme(ui === document ? document : ui);
  applyTheme(document);
  renderBoard();
}
