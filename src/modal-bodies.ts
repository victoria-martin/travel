import { AccommodationModal } from './domains/accommodations/modal/AccommodationModal';
import { AirbnbAccommodationModal } from './domains/accommodations/modal/AirbnbAccommodationModal';
import { BookingAccommodationModal } from './domains/accommodations/modal/BookingAccommodationModal';
import { GoogleMapsAccommodationModal } from './domains/accommodations/modal/GoogleMapsAccommodationModal';
import { HomeExchangeAccommodationModal } from './domains/accommodations/modal/HomeExchangeAccommodationModal';
import { PasteImportModal } from './domains/accommodations/modal/PasteImportModal';
import { AttractionModal } from './domains/attractions/modal/AttractionModal';
import { CarModelModal } from './domains/car-models/modal/CarModelModal';
import { ActualExpenseModal } from './domains/expenses/modal/ActualExpenseModal';
import { ImportExpensesModal } from './domains/expenses/modal/ImportExpensesModal';
import { FixedCostModal } from './domains/fixed-costs/modal/FixedCostModal';
import { PackingItemModal } from './domains/packing/modal/PackingItemModal';
import { OfferModal } from './domains/rentals/modal/OfferModal';
import { ScenarioPanelModal } from './domains/scenarios/detail/panel-modal/ScenarioPanelModal';
import { StepModal } from './domains/scenarios/detail/step-modal/StepModal';
import { ProviderModal } from './domains/transports/modal/ProviderModal';
import { TransportModal } from './domains/transports/modal/TransportModal';
import { AddTranslationModal } from './domains/translations/modal/AddTranslationModal';
import { TravelModal } from './domains/travels/modal/TravelModal';
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
  transport: TransportModal,
  accommodation: AccommodationModal,
  'accommodation-booking': BookingAccommodationModal,
  'accommodation-home-exchange': HomeExchangeAccommodationModal,
  'accommodation-airbnb': AirbnbAccommodationModal,
  'accommodation-google-maps': GoogleMapsAccommodationModal,
  step: StepModal,
  'scenario-panel': ScenarioPanelModal,
  'paste-import': PasteImportModal,
  voyage: TravelModal,
};
