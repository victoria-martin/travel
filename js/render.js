/*
  Phase 4 (docs/react-migration-plan.md § 1) : React possède #app en entier (src/shell/AppShell.tsx,
  monté une fois dans src/main.tsx). render() ne reconstruit plus rien ici — il notifie
  __reactStateSubscribers, la même liste que useTravelStore, et laisse React se re-rendre lui-même.
  Conséquence : react-dist/react-app.js devient une dépendance dure, pas un filet de secours — s'il
  ne charge pas, #app reste vide (plus de repli sur un rendu 100 % legacy, possible avant cette
  phase).
*/
function render() {
  window.__reactStateSubscribers?.forEach((cb) => cb());
}

/*
  Un changement de mise en page se montre au lieu de sauter. React s'en charge lui-même pour les
  éléments qu'il réconcilie (la même ligne reste la même ligne), ce commentaire ne vaut donc plus
  que pour startViewTransition lui-même, toujours utile pour animer un changement de vue.
*/
function renderWithTransition() {
  if (!document.startViewTransition) return render();
  document.startViewTransition(() => render());
}
