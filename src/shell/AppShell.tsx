import { useEffect } from 'react';
import { useTravelStore } from '../store/useTravelStore';
import { AskOverlayHost } from './AskOverlayHost';
import { Confirm } from './Confirm';
import { MainContent } from './MainContent';
import { MobileNav } from './MobileNav';
import { ModalHost } from './ModalHost';
import { Sidebar } from './Sidebar';
import { Toast } from './Toast';

/*
  Racine unique du shell (Phase 4, docs/en-cours/react-migration-plan.md § 1) : React possède #app en
  entier — plus de app.innerHTML reconstruit à chaque render() legacy, plus de root imbriqué dans
  #main (mountReactView/REACT_VIEWS, devenus inutiles). `render()` (js/render.js) se contente
  désormais de notifier __reactStateSubscribers, la même liste qu'utilise déjà useTravelStore ;
  pas de sélecteur ici, ce composant doit se re-rendre sur TOUT changement, pas seulement sur une
  tranche typée de `state`.
*/
export function AppShell() {
  useTravelStore();

  useEffect(() => {
    window.applyTravelAccent();
    window.applyTravelTab();
    window.applyFlash();
    window.placeOpenInlineMenu();
  });

  return (
    <>
      <Sidebar />
      <MobileNav />
      <MainContent />
      <Toast />
      <ModalHost />
      <Confirm />
      <AskOverlayHost />
    </>
  );
}
