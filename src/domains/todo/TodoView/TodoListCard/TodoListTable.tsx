import { columns as accommodationColumns } from '@/domains/accommodations/AccommodationsView/columns';
import { columns as attractionColumns } from '@/domains/attractions/AttractionsView/columns';
import { columns as fixedCostColumns } from '@/domains/fixed-costs/columns';
import { offerColumns } from '@/domains/transports/TransportsView/CarsTab/OffersSection/columns';
import { columns as transportColumns } from '@/domains/transports/TransportsView/TransportsListTab/columns';
import { DataTable } from '@/shared/DataTable/DataTable';
import { visibleColumns } from '@/shared/DataTable/visibleColumns';
import type { Accommodation, Attraction, FixedCost, Offer, Transport } from '@/store/types';
import type { ReactNode } from 'react';

// A list shows the table of the page it draws from: same columns, same cells, same row click.
const TABLES: Record<string, (items: unknown[]) => ReactNode> = {
  hebergements: (items) => (
    <DataTable
      kind="hebergements"
      columns={visibleColumns('hebergements', accommodationColumns)}
      items={items as Accommodation[]}
      onRowClick={(accommodation) => window.openSheet('accommodation', accommodation.id)}
    />
  ),
  attractions: (items) => (
    <DataTable
      kind="attractions"
      columns={visibleColumns('attractions', attractionColumns)}
      items={items as Attraction[]}
      onRowClick={(attraction) => window.openAttractionSheet(attraction.id)}
    />
  ),
  transports: (items) => (
    <DataTable
      columns={visibleColumns('transports', transportColumns)}
      items={items as Transport[]}
    />
  ),
  locations: (items) => (
    <DataTable
      columns={visibleColumns(
        'locations',
        offerColumns(window.ofCurrentTravel(window.state.carModels)),
      )}
      items={items as Offer[]}
      onRowClick={(offer) => window.openSheet('voiture', offer.id)}
    />
  ),
  charges: (items) => (
    <DataTable columns={visibleColumns('charges', fixedCostColumns)} items={items as FixedCost[]} />
  ),
};

export function TodoListTable({ kind, items }: { kind: string; items: unknown[] }) {
  return TABLES[kind]?.(items);
}
