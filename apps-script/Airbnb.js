/*
  Scraping d'une annonce Airbnb, appelé par le front via `?airbnb=<url>`.
  Même raison que Booking : airbnb.fr ne renvoie pas d'en-tête CORS, le navigateur ne peut pas
  lire la page lui-même.

  Le JSON-LD `VacationRental` porte le nom, la ville et les coordonnées — approximatives tant que
  le séjour n'est pas réservé, c'est tout ce qu'Airbnb publie.
  La région et le pays ne sont que dans le `<title>` : « … à louer à <ville>, <région>, <pays> »,
  d'où la lecture systématique du domaine français — un lien `.com` répond une page de bascule de
  domaine, et un titre anglais ne porterait pas la même phrase.
  Le prix, lui, n'est nulle part dans la page servie, même quand le lien porte des dates : Airbnb
  le charge après coup.
*/

var AIRBNB_URL = /^https?:\/\/([a-z0-9-]+\.)*airbnb\.[a-z.]{2,6}\//i;

var AIRBNB_TITLE_LEVELS = /\sà louer à ([^<]*?) - Airbnb<\/title>/;

function scrapeAirbnb(url) {
  if (!AIRBNB_URL.test(String(url || ''))) {
    return { error: 'Ce lien n’est pas une annonce Airbnb.' };
  }
  var res = UrlFetchApp.fetch(airbnbFrenchUrl(url), {
    followRedirects: true,
    muteHttpExceptions: true,
    headers: BROWSER_HEADERS,
  });
  if (res.getResponseCode() !== 200) {
    return { error: 'Airbnb a répondu ' + res.getResponseCode() + '.' };
  }
  var html = res.getContentText();
  var ld = airbnbListing(html);
  var levels = airbnbTitleLevels(html);
  var stay = {
    name: decodeEntities(ld.name || ''),
    lat: ld.latitude ? String(ld.latitude) : '',
    lng: ld.longitude ? String(ld.longitude) : '',
    city: decodeEntities((ld.address || {}).addressLocality || '') || levels[0] || '',
    region: levels[1] || '',
    country: levels[2] || '',
  };
  if (!stay.name && !stay.city) {
    return { error: 'Annonce illisible : la page a peut-être changé.' };
  }
  return stay;
}

// Un lien `.com` répond un formulaire de bascule de domaine que seul un navigateur soumet.
function airbnbFrenchUrl(url) {
  return String(url).replace(
    /^(https?:\/\/)([a-z0-9-]+\.)*airbnb\.[a-z.]{2,6}\//i,
    '$1www.airbnb.fr/',
  );
}

// Le logement est le seul nœud à porter des coordonnées ; les autres décrivent le produit et la note.
function airbnbListing(html) {
  var nodes = jsonLdNodes(html);
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i] && nodes[i].latitude) return nodes[i];
  }
  return {};
}

// « … - Appartements à louer à Sienne, Toscane, Italie - Airbnb » : ville, région, pays.
function airbnbTitleLevels(html) {
  var found = html.match(AIRBNB_TITLE_LEVELS);
  if (!found) return [];
  return decodeEntities(found[1])
    .split(',')
    .map(function (part) {
      return part.trim();
    });
}

// À lancer depuis l'éditeur : force la demande d'autorisation UrlFetchApp et journalise le résultat.
function testAirbnb() {
  var stay = scrapeAirbnb('https://www.airbnb.fr/rooms/53839470');
  Logger.log(JSON.stringify(stay, null, 2));
  return stay;
}
