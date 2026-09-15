function rentalCard(rental) {
  const vehicles = rentalVehicles(rental.id);
  const open = isRentalOpen(rental.id);
  return /* HTML */ `<div class="rental-card">
    <button class="rental-head" onclick="toggleRental('${rental.id}')">
      <span class="rental-title">${svgIcon('car')} ${escapeHtml(rentalLabel(rental))}</span>
      <span class="rental-dates">${escapeHtml(rentalDatesLabel(rental).join(' · '))}</span>
      <span class="rental-count">
        ${vehicles.length} véhicule${vehicles.length > 1 ? 's' : ''}
        ${svgIcon(open ? 'chevron-down' : 'chevron-right')}
      </span>
    </button>
    <div class="rental-actions">
      ${editButton('location', rental.id)}${deleteButton('rentals', rental.id)}
    </div>
    ${open ? rentalVehicleRows(rental, vehicles) : ''}
  </div>`;
}

function rentalVehicleRows(rental, vehicles) {
  return /* HTML */ `<div class="rental-vehicles">
    ${vehicles.map(vehicleRow).join('')} ${vehicleDraftRow(rental.id)}
  </div>`;
}
