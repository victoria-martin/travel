/*
  Les cinq portes d'ajout d'un hébergement : quatre liens à coller, chacun avec son formulaire,
  et la saisie à la main. Le panneau se referme en ouvrant la modale, sans quoi il se rouvrirait
  derrière elle au rendu suivant.
*/
function accommodationAddMenu() {
  return toolbarPanel({
    key: 'add-accommodation',
    icon: svgIcon('plus'),
    label: 'Ajouter',
    body: /* HTML */ `<div class="filter-block">
      <p class="filter-title">Ajouter un hébergement</p>
      <button class="panel-action" onclick="openAccommodationDoor('accommodation-booking')">
        ${svgIcon('hotel')} Depuis un lien Booking
      </button>
      <button class="panel-action" onclick="openAccommodationDoor('accommodation-home-exchange')">
        ${svgIcon('house')} Depuis un lien HomeExchange
      </button>
      <button class="panel-action" onclick="openAccommodationDoor('accommodation-airbnb')">
        ${svgIcon('bed')} Depuis un lien Airbnb
      </button>
      <button class="panel-action" onclick="openAccommodationDoor('accommodation-google-maps')">
        ${svgIcon('map-pin')} Depuis un lien Google Maps
      </button>
      <button class="panel-action" onclick="openAccommodationDoor('accommodation')">
        ${svgIcon('pencil-line')} À la main
      </button>
    </div>`,
  });
}

function openAccommodationDoor(type) {
  openToolbarPanel = null;
  openModal(type);
}
