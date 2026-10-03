import { AddResourceButton } from '@/shared/buttons/AddResourceButton';

export const AddCarModelButton = () => {
  return (
    <AddResourceButton
      title="Ajouter un modèle"
      onClick={() => window.openModal('modele')}
      label="Modèle"
    />
  );
};
