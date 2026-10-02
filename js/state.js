// `var`, pas `let` : state.js est réassigné (loadData, sync) un peu partout dans le legacy sans
// jamais passer par `window.state = ...` — seul `var` (ou une fonction) s'attache à `window`
// automatiquement. React (useTravelStore) lit `window.state` ; un `let` l'aurait laissé undefined
// en permanence, peu importe où loadData() s'exécute dans l'ordre des scripts.
var state = null;
