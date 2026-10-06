import { createRoot } from 'react-dom/client';
import { AppShell } from './shell/AppShell';

/*
  Phase 4 (docs/archivé/react-migration-plan.md § 1) : un seul root React, monté une fois, possède #app en
  entier — sidebar, routage, contenu, toast, modale. js/render.js ne reconstruit plus rien en
  innerHTML, il se contente de notifier __reactStateSubscribers (AppShell en fait partie via
  useTravelStore) pour que React se re-rende lui-même sur toute mutation legacy.
*/
const container = document.getElementById('app');
if (container) createRoot(container).render(<AppShell />);
