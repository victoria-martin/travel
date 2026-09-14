/*
  Les quatre portes d'ajout d'un hébergement : trois liens à coller, chacun avec son formulaire,
  et la saisie à la main. Le panneau se referme en ouvrant la modale, sans quoi il se rouvrirait
  derrière elle au rendu suivant.
*/
function accommodationAddMenu() {
  return toolbarPanel({
    key: 'add-accommodation',
    icon: '+',
    label: 'Ajouter',
    body: /* HTML */ `<div class="filter-block">
      <p class="filter-title">Ajouter un hébergement</p>
      <button class="panel-action" onclick="openAccommodationDoor('accommodation-booking')">
        🏨 Depuis un lien Booking
      </button>
      <button class="panel-action" onclick="openAccommodationDoor('accommodation-home-exchange')">
        🏡 Depuis un lien HomeExchange
      </button>
      <button class="panel-action" onclick="openAccommodationDoor('accommodation-airbnb')">
        🛏️ Depuis un lien Airbnb
      </button>
      <button class="panel-action" onclick="openAccommodationDoor('accommodation')">
        ✍️ À la main
      </button>
    </div>`,
  });
}

function openAccommodationDoor(type) {
  openToolbarPanel = null;
  openModal(type);
}
