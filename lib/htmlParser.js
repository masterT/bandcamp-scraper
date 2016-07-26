var cheerio = require('cheerio');
var scrapeIt = require("scrape-it");
var urlHelper = require('url');
var utils = require('./utils.js');
var linez = require('linez')
var Ajv = require('ajv');

// add search-result Schema
var ajv = new Ajv();
ajv.addSchema(require('../schemas/search-result.json'), 'search-result');
ajv.addSchema(require('../schemas/album-product.json'), 'album-product');
ajv.addSchema(require('../schemas/album-info.json'), 'album-info');


linez.configure({
  newlines: ['\n', '\r\n', '\r']
});

var removeMultipleSpace = function (text) {
  return text.replace(/\s{2,}/g, ' ');
};

var removeNewLine = function (text) {
  text = linez(text).lines.map(function(line) {
    return line.text.trim();
  }).join(' ');
  return removeMultipleSpace(text);
};

var assignProps = function (objFrom, objTo, propNames) {
  propNames.forEach(function (propName) {
    objTo[propName] = objFrom[propName];
  });
  return objTo;
};


// parse search results
exports.parseSearchResults = function (html) {
  var $ = cheerio.load(html);
  var data = scrapeIt.scrapeHTML($, {
    results: {
      listItem: ".result-items li",
      data: {
        type: {
          selector: ".itemtype",
          convert: function (text) {
            return text.toLowerCase();
          },
        },
        name: { selector: ".heading" },
        url: { selector: ".itemurl" },
        imageUrl: { selector: ".art img", attr: "src" },
        tags: {
          selector: ".tags",
          convert: function (text) {
            var tags = text.replace('tags:', '').replace(/\s/g, '');
            return tags.length > 1 ? tags.split(',') : [];
          }
        },
        genre: {
          selector: ".genre",
          convert: function (text) {
            return removeMultipleSpace(text.replace('genre:', ''));
          }
        },
        subhead: {
          selector: ".subhead",
          convert: function (text) {
            return removeMultipleSpace(text);
          }
        },
        releaseDate: {
          selector: ".released",
          convert: function (text) {
            return text.replace('released ', '');
          }
        },
        numTracks: {
          selector: ".length",
          convert: function (text) {
            var info = text.split(',');
            if (info.length == 2) {
              return parseInt(info[0].replace(' tracks', ''));
            }
          }
        },
        numMinutes: {
          selector: ".length",
          convert: function (text) {
            var info = text.split(',');
            if (info.length == 2) {
              return parseInt(info[1].replace(' minutes', ''));
            }
          }
        }
      }
    }
  });
  return data.results.reduce(function (results, result) {
    // basic properties
    var object = assignProps(result, {}, ['type', 'name', 'url', 'imageUrl', 'tags']);
    // specific properties
    switch (result.type) {
      case 'artist':
        // genre
        object.genre = result.genre;
        // location
        result.location = removeMultipleSpace(result.subhead).trim();
        break;
      case 'album':
        // album's specific properties
        assignProps(result, {}, ['releaseDate', 'numTracks', 'numMinutes']);
        // artist
        object.artist = result.subhead.replace('by ', '').trim();
        break;
      case 'track':
        // released date
        object.releaseDate = result.releaseDate;
        //  album & artist
        if (result.subhead) {
          var info = result.subhead.trim().split(' by ');
          if (info.length > 0) {
            object.album = removeNewLine(info[0].replace('location', ''))
            info.shift();
            object.artist = removeNewLine(info.join(' by '))
          }
        }
        break;
      case 'fan':
      // genre
      object.genre = result.genre;
      break;
    }
    // validate through JSON schema
    if (ajv.validate('search-result', object)) {
      results.push(object);
    } else { // TODO add a flag to log only when debugging
      console.error('Validation error on search result: ', ajv.errorsText(), object, ajv.errors);
    }
    return results;
  }, []);
}


// parse album urls
exports.parseAlbumUrls = function (html, artistUrl) {
  var $ = cheerio.load(html);
  var data = scrapeIt.scrapeHTML($, {
    albumLinks: {
      listItem: "a",
      data: {
        url: {
          attr: "href",
          convert: function (href) {
            if (/^\/(track|album)\/(.+)$/.exec(href)) {
              return urlHelper.resolve(artistUrl, href);
            }
          }
        }
      }
    }
  });
  return data.albumLinks.reduce(function (albumUrls, albumLink) {
    var url = albumLink.url;
    if (url) {
      if (albumUrls.indexOf(url) == -1) {
        albumUrls.push(url);
      }
    }
    return albumUrls;
  }, []);
};

// parse album info
exports.parseAlbumInfo = function (html, albumUrl) {
  var $ = cheerio.load(html);
  var data = scrapeIt.scrapeHTML($, {
    album: {
      selector: 'body',
      data: {
        artist: { selector: "#name-section span" },
        title: { selector: "#name-section .trackTitle" },
        imageUrl: {
          selector: "#tralbumArt img",
          attr: 'src',
          convert: function (src) {
            if (src) {
              return src.replace(/_\d{1,3}\./, "_2."); // use small version
            }
          }
        },
        tracks: {
          listItem: 'table#track_table tr.track_row_view',
          data: {
            name: { selector: 'span[itemprop=name]' },
            url: {
              selector: 'a[itemprop=url]',
              attr: 'href',
              convert: function (href) {
                return urlHelper.resolve(albumUrl, href);
              }
            },
            duration: {
              selector: 'meta[itemprop=duration]',
              attr: 'content'
            }
          }
        }
      }
    }
  });
  var object = assignProps(data.album, {}, ['artist', 'title', 'imageUrl', 'tracks']);
  object.raw = parseAlbumRawInfo($.html());
  // validate through JSON schema
  if (ajv.validate('album-info', object)) {
    return object;
  } else { // TODO add a flag to log only when debugging
    console.error('Validation error on album info: ', ajv.errorsText(), object);
    return null;
  }
};


// parse album info  hidden in the javascript
var trRegex = /var TralbumData = ({[\s\S]*is_band_member: (true|false|null)\s+});/;
var urlCleanupRegex = /url:\s"([^"]+)"(?:\s+\+\s+)?"([^"]+)",/g;
var cleanupCommentRegex = /\s?(\/\/\s[^\n]+)/g;
var jsonifyKeyRegex = /\s\s([a-zA-Z\_]+)\s?\:\s([^,]+)(,|\s)/g;
var parseAlbumRawInfo = function (html) {
  var match = trRegex.exec(html);
  if (match) {
    match = match[1].replace(cleanupCommentRegex, '');
    match = match.replace(urlCleanupRegex, '"url": "$1$2",');
    match = match.replace(jsonifyKeyRegex, '"$1": $2$3');
    return JSON.parse(match);
  }
  return null;
};


// parse album products
exports.parseAlbumProducts = function (html, albumUrl) {
  var albumInfo = this.parseAlbumInfo(html, albumUrl);
  var $ = cheerio.load(html);
  var data = scrapeIt.scrapeHTML($, {
    products: {
      listItem: '.buyItem',
      data: {
        imageUrls: {
          listItem: '.popupImageGallery img',
          data: {
            url: { attr: 'src' }
          }
        },
        name: {
          selector: '.buyItemPackageTitle',
          convert: removeNewLine
        },
        nameFallback: {  // fallback
          selector: '.hd.lowHeadroom',
          convert: removeNewLine
        },
        format: {
          selector: '.buyItemPackageTitle'
        },
        formatFallback: {  // fallback
          selector: '.merchtype'
        },
        priceInCents: {
          selector: '.ft span.base-text-color',
          convert: function (text) {
            var matches = text.match(/(\d+)([\.\,]?)(\d{0,2})/);
            if (matches) {
              return parseInt(matches[1] + (matches[3] || "00"));
            } else {
              return null;
            }
          }
        },
        // currency
        currency: {
          selector: '.ft span.secondaryText',
          eq: 0,
        },
        offerMore: {
          selector: '.ft span.secondaryText',
          eq: 1,
          convert: function (text) {
            return text.toLowerCase() === 'or more';
          }
        },
        soldOut: {
          selector: '.notable',
          convert: function (text) {
            return text.toLowerCase() === 'sold out';
          }
        },
        nameYourPrice: {
          selector: '.ft span.secondaryText',
          convert: function (text) {
            return text.toLowerCase() === 'name your price';
          }
        },
        description: {
          selector: '.bd',
          convert: function (text) {
            return removeNewLine(text.trim());
          }
        }
      }
    }
  });
  return data.products.reduce(function (products, product) {
    // basic properties
    var object = assignProps(product, {}, ['description', 'soldOut', 'nameYourPrice', 'offerMore', 'nameYourPrice']);
    // url
    object.url = albumUrl;
    // format
    object.format = product.format || product.formatFallback || 'Other';
    // name
    if (object.format.match(/digital\s(track|album)/i)) {
      // digital have a different name
      object.name = albumInfo.title;
    } else {
      object.name = product.name || product.nameFallback;
    }
    // imageUrls
    if (product.imageUrls.length == 0) {
      object.imageUrls = [ albumInfo.imageUrl ];
    } else {
      object.imageUrls = product.imageUrls.map(function (imageUrl) {
        return imageUrl.url;
      });
    }
    // price
    if (product.soldOut) {
      object.priceInCents = null;
      object.currency = null;
    } else if (product.nameYourPrice) {
      object.priceInCents = 0;
      object.currency = null;
    } else {
      object.priceInCents = product.priceInCents;
      object.currency = product.currency;
    }
    // validate through JSON schema
    if (ajv.validate('album-product', object)) {
      products.push(object)
    } else { // TODO add a flag to log only when debugging
      console.error('Error: ', ajv.errorsText(), object, JSON.stringify(ajv.errors));
    }
    return products;
  }, []);
};
