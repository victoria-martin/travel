import { AttractionModal } from './domains/attractions/modal/AttractionModal';
import { CarModelModal } from './domains/car-models/modal/CarModelModal';
import { ActualExpenseModal } from './domains/expenses/modal/ActualExpenseModal';
import { ImportExpensesModal } from './domains/expenses/modal/ImportExpensesModal';
import { FixedCostModal } from './domains/fixed-costs/modal/FixedCostModal';
import { PackingItemModal } from './domains/packing/modal/PackingItemModal';
import { OfferModal } from './domains/rentals/modal/OfferModal';
import { ProviderModal } from './domains/transports/modal/ProviderModal';
import { AddTranslationModal } from './domains/translations/modal/AddTranslationModal';
import { VilleModal } from './domains/villes/modal/VilleModal';

/*
  Le corps d'une modale, par type — ce que ModalHost pose dans Dialog.Content. Pas que des
  formulaires à terme : valise-composer (checklist), scenario-panel/journal-panel (contenu de
  panneau) n'en sont pas, d'où un nom qui couvre tout, en écho à `cfg.body` dans MODAL_TYPES
  (modal.js) — un type absent d'ici reste peint par ModalHost en dangerouslySetInnerHTML via
  `cfg.body`. Le reste de la mécanique (open/edits, dirty-check, dismissModal, Entrée/Échap) ne
  change pas, peu importe qui peint le contenu : modalFieldsState() (modal.js) lit le DOM
  générique (input/textarea/select sous .modal).
*/
export const MODAL_BODIES: Record<string, (props: { payload: any }) => React.JSX.Element> = {
  'actual-expense': ActualExpenseModal,
  'import-expenses': ImportExpensesModal,
  charge: FixedCostModal,
  'valise-catalogue': PackingItemModal,
  phrase: AddTranslationModal,
  attraction: AttractionModal,
  voiture: OfferModal,
  prestataire: ProviderModal,
  modele: CarModelModal,
  ville: VilleModal,
};
