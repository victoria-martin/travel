/*
  Shared HTML helpers for the scrapers (HomeExchange, Booking).
*/

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
