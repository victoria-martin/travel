/*
  Lecture d'une fiche Google Maps, appelée par le front via `?googleMaps=<url>`.
  Même raison que Booking : google.com ne renvoie pas d'en-tête CORS.

  Deux sources, de la plus stable à la moins stable :
  - l'URL finale porte le nom (`/maps/place/<nom>/`) et les coordonnées du lieu (`!3d<lat>!4d<lng>`,
    et à défaut le centre de la vue `@lat,lng`) — c'est Google qui les écrit, pas une mise en page ;
  - le HTML ne sert qu'à l'adresse, lue dans les métadonnées de partage.
  Un lien court (`maps.app.goo.gl`) ne porte rien : il faut d'abord le suivre, et UrlFetchApp
  n'expose pas l'URL finale, d'où les redirections suivies à la main.
*/

var GOOGLE_MAPS_URL =
  /^https?:\/\/((maps\.app\.goo\.gl|goo\.gl)\/|([a-z0-9-]+\.)*google\.[a-z.]{2,6}\/maps)/i;

var MAPS_REDIRECT_LIMIT = 5;

var MAPS_ADDRESS_PATTERNS = [
  /<meta content="([^"]*)" property="og:description">/,
  /<meta property="og:description" content="([^"]*)"/,
  /<meta content="([^"]*)" itemprop="description">/,
];

function scrapeGoogleMaps(url) {
  if (!GOOGLE_MAPS_URL.test(String(url || ''))) {
    return { error: 'Ce lien n’est pas une fiche Google Maps.' };
  }
  var resolved = resolveGoogleMapsUrl(url);
  if (resolved.error) return resolved;

  var place = {
    name: googleMapsName(resolved.url),
    address: googleMapsAddress(resolved.html),
  };
  var point = googleMapsPoint(resolved.url);
  place.lat = point.lat;
  place.lng = point.lng;

  if (!place.name && !place.lat) {
    return { error: 'Fiche illisible : le lien ne mène peut-être pas à un lieu précis.' };
  }
  return place;
}

// UrlFetchApp ne dit pas où il a atterri : on suit les redirections nous-mêmes pour garder l'URL.
function resolveGoogleMapsUrl(url) {
  var current = url;
  for (var i = 0; i < MAPS_REDIRECT_LIMIT; i++) {
    var res = UrlFetchApp.fetch(current, {
      followRedirects: false,
      muteHttpExceptions: true,
      headers: BROWSER_HEADERS,
    });
    var code = res.getResponseCode();
    if (code < 300 || code >= 400) {
      if (code !== 200) return { error: 'Google a répondu ' + code + '.' };
      return { url: current, html: res.getContentText() };
    }
    var location = googleMapsLocation(res);
    if (!location) return { error: 'Lien court illisible : Google n’a pas dit où il redirige.' };
    current = location;
  }
  return { error: 'Le lien redirige en boucle.' };
}

function googleMapsLocation(res) {
  var headers = res.getAllHeaders();
  return headers.Location || headers.location || '';
}

// `/maps/place/Torre+del+Palacio/@43.8,10.5,17z` — le segment qui suit `place` est le nom.
function googleMapsName(url) {
  var found = url.match(/\/maps\/place\/([^/@?]+)/);
  if (!found) return '';
  try {
    return decodeURIComponent(found[1].replace(/\+/g, ' ')).trim();
  } catch (err) {
    return found[1].replace(/\+/g, ' ').trim();
  }
}

// `!3d<lat>!4d<lng>` est la position du lieu ; `@lat,lng` n'est que le centre de la vue.
function googleMapsPoint(url) {
  var exact = url.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/);
  var view = url.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  var found = exact || view;
  return found ? { lat: found[1], lng: found[2] } : { lat: '', lng: '' };
}

// La description de partage se lit « ★★★★☆ · Restaurant · Adresse » : l'adresse est le dernier morceau.
function googleMapsAddress(html) {
  var shown = matchFirst(html, MAPS_ADDRESS_PATTERNS);
  if (!shown) return '';
  var parts = shown.split('·');
  return parts[parts.length - 1].trim();
}

// À lancer depuis l'éditeur : force la demande d'autorisation UrlFetchApp et journalise le résultat.
function testGoogleMaps() {
  var place = scrapeGoogleMaps('https://maps.app.goo.gl/BKQXqqXEKW8K1GjS7');
  Logger.log(JSON.stringify(place, null, 2));
  return place;
}
