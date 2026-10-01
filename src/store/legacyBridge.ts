import { useSyncExternalStore } from 'react';

function subscribe(callback: () => void): () => void {
  window.__reactStateSubscribers ??= new Set();
  window.__reactStateSubscribers.add(callback);
  return () => window.__reactStateSubscribers?.delete(callback);
}

function getSnapshot() {
  return window.state;
}

/*
  Pont du spike (Phase 0a, docs/react-migration-plan.md) : lit la globale `state` legacy telle
  quelle, notifiée par js/render.js à chaque re-rendu. Remplacé par le store Zustand en Phase 0b,
  une fois le mécanisme de montage/démontage validé — pas avant.
*/
export function useLegacyState() {
  return useSyncExternalStore(subscribe, getSnapshot);
}
