/**
* Plugin for scraping machusonline.
*/
var cheerio = require('cheerio');
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));

function parseHTML(contents) {
  var offers;

  var data = {};
  var $ = cheerio.load(contents[1]);

  data.title = $('[itemprop=name]').text();

  data.url = $('[itemprop=url]').attr('content');
  data.image = $('[itemprop=image]').attr('content');

  offers = $('[itemprop=offers]');
  data.price = $('.price', offers).text().replace(/\r?\n|\r/g, '').trim();
  data.currency = $('[itemprop=priceCurrency]', offers).attr('content');
  data.inStock = $('[itemprop=availability]', offers).attr('href') === 'http://schema.org/InStock';

  return Promise.resolve(data);
}

module.exports = {
  fetch: function(url) {
    return request(url).then(parseHTML);
  }
};
