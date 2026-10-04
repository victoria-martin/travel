import { create } from 'zustand';
import type { TravelData } from './types';

interface TravelStore {
  data: TravelData;
}

/*
  Phase 0b (docs/en-cours/react-migration-plan.md § 2) : miroir typé de la globale `state` legacy, recopié
  à chaque re-rendu legacy — js/render.js notifie __reactStateSubscribers, posé en Phase 0a.
  Lecture seule pour l'instant : les mutations restent legacy (upsertX, saveNow) le temps de la
  Phase 1, où chaque domaine migré gagnera ses actions typées au fur et à mesure qu'il en a besoin.
*/
export const useTravelStore = create<TravelStore>(() => ({
  data: window.state as TravelData,
}));

window.__reactStateSubscribers ??= new Set();
window.__reactStateSubscribers.add(() => {
  useTravelStore.setState({ data: window.state as TravelData });
});
