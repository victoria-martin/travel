import { DataTable } from '@/shared/DataTable/DataTable';

export const CarModelsTable = ({ columns, items }: { columns: any; items: any }) => {
  if (!items) {
    return (
      <div className="empty-state">
        <strong>Aucun modèle</strong>
        Ajoute un modèle, ou tape-le en relevant une offre : il rejoint le catalogue.
      </div>
    );
  }

  return <DataTable columns={columns} items={items} />;
};
