// Partagé par accommodationPopup et attractionPopup (js/views/map/markers.js, popupName).
export function popupName(name: string, favorite: boolean, url: string): string {
  const label = `${favorite ? `${window.svgIcon('star', { fill: true })} ` : ''}${name}`;
  return url
    ? `<a href="${url}" target="_blank" rel="noreferrer" class="external-link">${label}</a>`
    : label;
}
