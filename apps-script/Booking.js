/*
  Scraping d'une annonce Booking, appelé par le front via `?booking=<url>`.
  Même raison que HomeExchange : booking.com ne renvoie pas d'en-tête CORS, le navigateur ne
  peut pas lire la page lui-même.

  Deux sources dans la page, de la plus stable à la moins stable :
  - le JSON-LD `@type: Hotel` porte le nom et l'adresse postale découpée ;
  - les `data-testid` portent le reste (prix), et servent de secours pour le nom.
  Le prix n'existe que si le lien contient des dates (`checkin`/`checkout`) : sans elles, Booking
  n'affiche aucun montant.
*/

var BOOKING_URL = /^https?:\/\/([a-z0-9-]+\.)*booking\.com\//i;

// Sans user-agent de navigateur, Booking sert une page réduite sans JSON-LD.
var BROWSER_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

var BOOKING_NAME_PATTERNS = [
  /data-testid="title"[^>]*>([\s\S]*?)</,
  /<h2[^>]*class="[^"]*pp-header__title[^"]*"[^>]*>([\s\S]*?)<\/h2>/,
];

var BOOKING_ADDRESS_PATTERNS = [
  /data-testid="address"[^>]*>([\s\S]*?)<\/(?:div|span|p)>/,
  /class="[^"]*hp_address_subtitle[^"]*"[^>]*>([\s\S]*?)<\//,
];

var BOOKING_PRICE_PATTERNS = [
  /data-testid="price-and-discounted-price"[^>]*>([\s\S]*?)<\/span>/,
  /data-testid="price-for-x-nights"[^>]*>([\s\S]*?)<\/span>/,
];

// Booking annonce le type d'hébergement dans le `@type` du JSON-LD.
var BOOKING_TYPES = { Apartment: 'house', House: 'house', VacationRental: 'house' };

function scrapeBooking(url) {
  if (!BOOKING_URL.test(String(url || ''))) {
    return { error: 'Ce lien n’est pas une annonce Booking.' };
  }
  var res = UrlFetchApp.fetch(url, {
    followRedirects: true,
    muteHttpExceptions: true,
    headers: { 'User-Agent': BROWSER_UA, 'Accept-Language': 'fr-FR,fr;q=0.9' },
  });
  if (res.getResponseCode() !== 200) {
    return { error: 'Booking a répondu ' + res.getResponseCode() + '.' };
  }
  var html = res.getContentText();
  var ld = bookingJsonLd(html);
  var address = ld.address || {};
  var stay = {
    name: decodeEntities(ld.name || '') || matchFirst(html, BOOKING_NAME_PATTERNS),
    type: BOOKING_TYPES[ld['@type']] || 'hotel',
    address:
      decodeEntities(address.streetAddress || '') || matchFirst(html, BOOKING_ADDRESS_PATTERNS),
    city: decodeEntities(address.addressLocality || ''),
    region: decodeEntities(address.addressRegion || ''),
    price: bookingPrice(html),
  };
  if (!stay.name && !stay.address) {
    return { error: 'Annonce illisible : la page a peut-être changé.' };
  }
  return stay;
}

// La page porte plusieurs blocs JSON-LD (fil d'Ariane, FAQ…) : on garde celui de l'hébergement.
function bookingJsonLd(html) {
  var blocks = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi);
  if (!blocks) return {};
  for (var i = 0; i < blocks.length; i++) {
    var body = blocks[i].replace(/^[\s\S]*?>/, '').replace(/<\/script>$/i, '');
    var parsed;
    try {
      parsed = JSON.parse(body);
    } catch (err) {
      continue;
    }
    var nodes = [].concat(parsed['@graph'] || parsed);
    for (var j = 0; j < nodes.length; j++) {
      if (nodes[j] && nodes[j].address) return nodes[j];
    }
  }
  return {};
}

// Le montant affiché garde sa monnaie et ses séparateurs : on ne garde que les chiffres.
function bookingPrice(html) {
  var shown = matchFirst(html, BOOKING_PRICE_PATTERNS);
  var digits = shown.replace(/[^0-9]/g, '');
  return digits || '';
}

// À lancer depuis l'éditeur : force la demande d'autorisation UrlFetchApp et journalise le résultat.
function testBooking() {
  var stay = scrapeBooking('https://www.booking.com/hotel/it/antico-casale-di-scansano.fr.html');
  Logger.log(JSON.stringify(stay, null, 2));
  return stay;
}
