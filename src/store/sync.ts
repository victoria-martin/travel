import type { TravelData } from './types';

/*
  Contrat visé (docs/react-migration-plan.md § 2, docs/protocole-sync-sheet.md) — PAS ENCORE
  implémenté. js/sync.js ne s'y prête pas tel quel : le push y est debouncé (schedulePush) et fait
  une fusion 3-voies entrée par entrée (mergeStates), pas un simple POST. L'écrire ici reviendrait à
  dupliquer ce protocole en parallèle du legacy — deux chemins qui écriraient sur le même Google
  Sheet, un risque réel pour les vraies données. Tant que ce n'est pas fait, le store ne lit/n'écrit
  QUE via le legacy (saveNow(), sync.js) — ce fichier documente juste la forme cible.
*/
export interface SyncAdapter {
  read(): Promise<{ rev: string; data: TravelData }>;
  push(
    data: TravelData,
    baseRev: string,
  ): Promise<{ rev: string; data: TravelData } | { conflict: true; rev: string; data: TravelData }>;
}
