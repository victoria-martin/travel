function priceEditable(a) {
  const price = editableText(a.price, `setAccommodationPrice('${a.id}', this.innerText)`, {
    key: `accommodation:${a.id}:price`,
    placeholder: ' - ',
  });
  return `${price} ${accommodationPriceUnit(a)}`;
}
