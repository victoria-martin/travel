/*
  Scraping d'une annonce HomeExchange, appelé par le front via `?homeExchange=<url>`.
  Il passe par ici parce que homeexchange.fr ne renvoie aucun en-tête CORS : un fetch
  depuis le navigateur échouerait. Tout ce qu'on lit est dans le HTML servi, sans login.
*/

var HOME_EXCHANGE_URL = /^https?:\/\/([a-z0-9-]+\.)*homeexchange\.(fr|com)\//i;

function scrapeHomeExchange(url) {
  if (!HOME_EXCHANGE_URL.test(String(url || ''))) {
    return { error: 'Ce lien n’est pas une annonce HomeExchange.' };
  }
  var res = UrlFetchApp.fetch(url, { followRedirects: true, muteHttpExceptions: true });
  if (res.getResponseCode() !== 200) {
    return { error: 'HomeExchange a répondu ' + res.getResponseCode() + '.' };
  }
  var html = res.getContentText();
  var home = {
    name: hostFirstName(matchOne(html, /<h1[^>]*id="title"[^>]*>([\s\S]*?)<\/h1>/)),
    city: breadcrumbLevel(html, 'admin3'),
    county: breadcrumbLevel(html, 'admin2'),
    region: breadcrumbLevel(html, 'admin1'),
    gp: matchOne(html, /itemprop="price"\s+content="([0-9]+)"/),
  };
  if (!home.name && !home.city) return { error: 'Annonce illisible : la page a peut-être changé.' };
  return home;
}

// Les titres HomeExchange finissent souvent par « … - chez Rosanna » : l'hôte passe devant.
var HOST_SUFFIX = /^(.+?)\s+-\s+chez\s+(.+)$/i;

function hostFirstName(title) {
  var found = title.match(HOST_SUFFIX);
  return found ? 'Chez ' + found[2] + ' - ' + found[1] : title;
}

// Les fils d'Ariane portent le niveau administratif : admin1 région, admin2 province, admin3 ville.
function breadcrumbLevel(html, level) {
  return matchOne(
    html,
    new RegExp(
      'data-breadcrumb-level="' + level + '"[\\s\\S]*?<span itemprop="name">([\\s\\S]*?)<\\/span>',
    ),
  );
}

function matchOne(html, re) {
  var found = html.match(re);
  if (!found) return '';
  return decodeEntities(found[1].replace(/<[^>]*>/g, ''))
    .replace(/\s+/g, ' ')
    .trim();
}

var NAMED_ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };

function decodeEntities(text) {
  return text
    .replace(/&#(\d+);/g, function (whole, code) {
      return String.fromCharCode(parseInt(code, 10));
    })
    .replace(/&([a-z]+);/gi, function (whole, name) {
      var known = NAMED_ENTITIES[name.toLowerCase()];
      return known === undefined ? whole : known;
    });
}

// À lancer depuis l'éditeur : force la demande d'autorisation UrlFetchApp et journalise le résultat.
function testHomeExchange() {
  var home = scrapeHomeExchange('https://www.homeexchange.fr/homes/view/427143');
  Logger.log(JSON.stringify(home, null, 2));
  return home;
}
