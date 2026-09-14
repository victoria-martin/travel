/*
  Shared HTML helpers for the scrapers (HomeExchange, Booking, Google Maps).
*/

// Without a browser user-agent, these sites serve a reduced page without their structured data.
var BROWSER_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
  'Accept-Language': 'fr-FR,fr;q=0.9',
};

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

// First match of a list of patterns: a page can name the same block in several ways.
function matchFirst(html, patterns) {
  for (var i = 0; i < patterns.length; i++) {
    var value = matchOne(html, patterns[i]);
    if (value) return value;
  }
  return '';
}

// Une page porte plusieurs blocs JSON-LD (fil d'Ariane, FAQ, produit…), parfois sous un `@graph` :
// chaque scraper reconnaît ensuite le sien.
function jsonLdNodes(html) {
  var blocks =
    html.match(/<script[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/gi) || [];
  var nodes = [];
  for (var i = 0; i < blocks.length; i++) {
    var body = blocks[i].replace(/^[\s\S]*?>/, '').replace(/<\/script>$/i, '');
    try {
      var parsed = JSON.parse(body);
      nodes = nodes.concat(parsed['@graph'] || parsed);
    } catch (err) {
      continue;
    }
  }
  return nodes;
}
