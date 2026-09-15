/*
  Un geste refait toute la page : ce qui vient de naître, et ce qui reste quand une comparaison se
  termine, se perdent dans le fil. Le nœud visé s'allume au rendu suivant et se ramène sous les
  yeux — une seule fois, le rendu consomme la demande. Une sortie, elle, s'anime avant d'être
  écrite : les nœuds qui s'en vont se replient, puis le geste s'applique.
*/
const FLASH_MS = 1100;
const COLLAPSE_MS = 260;

let flashedNodeId = null;

function flashOnNextRender(id) {
  flashedNodeId = id;
}

function applyFlash() {
  const node = flashedNodeId && document.getElementById(flashedNodeId);
  flashedNodeId = null;
  if (!node) return;
  node.classList.add('just-landed');
  node.scrollIntoView({ behavior: 'smooth', block: 'center' });
  setTimeout(() => node.classList.remove('just-landed'), FLASH_MS);
}

function collapseThen(ids, mutate) {
  const nodes = ids.map((id) => document.getElementById(id)).filter(Boolean);
  if (!nodes.length) return mutate();
  nodes.forEach((node) => node.classList.add('is-collapsing'));
  setTimeout(mutate, COLLAPSE_MS);
}
