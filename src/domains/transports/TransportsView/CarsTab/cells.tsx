import { VocabularyDropdown } from '../../../../shared/VocabularyDropdown';
import type { CarModel } from '../../../../store/types';

// Partagés entre OffersSection et ModelsSection : même dictionnaire, même setter, que la ligne
// soit une offre (via son modèle) ou le modèle lui-même.
export function FuelDropdown({ model }: { model: CarModel | undefined }) {
  if (!model) return <>—</>;
  return (
    <VocabularyDropdown
      className="fuel-dropdown"
      dict={window.CAR_FUELS}
      current={window.carFuel(model.fuel)}
      emptyOption={window.UNSET_CAR_FUEL}
      onPick={(fuel) => window.setCarModelFuel(model.id, fuel)}
    />
  );
}

export function GearboxDropdown({ model }: { model: CarModel | undefined }) {
  if (!model) return <>—</>;
  return (
    <VocabularyDropdown
      className="gearbox-dropdown"
      dict={window.CAR_GEARBOXES}
      current={window.carGearbox(model.gearbox)}
      emptyOption={window.UNSET_CAR_GEARBOX}
      onPick={(gearbox) => window.setCarModelGearbox(model.id, gearbox)}
    />
  );
}
