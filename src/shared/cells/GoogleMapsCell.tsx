import { LinkCell } from '@/shared/cells/LinkCell';

// Port de googleMapsCell (js/views/external-link.js): a search on the address, or on the name.
export function GoogleMapsCell({ query }: { query: string }) {
  return <LinkCell link={query ? window.googleMapsPlaceUrl(query) : ''} label="🗺️ Carte" />;
}
