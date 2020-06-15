var cheerio = require('cheerio');
var scrapeIt = require("scrape-it");
var urlHelper = require('url');
var utils = require('./utils.js');
var linez = require('linez');
var Ajv = require('ajv');
var JSON5 = require('json5');

// add search-result Schema
var ajv = new Ajv();
ajv.addSchema(require('../schemas/search-result.json'), 'search-result');
ajv.addSchema(require('../schemas/album-product.json'), 'album-product');
ajv.addSchema(require('../schemas/album-info.json'), 'album-info');
ajv.addSchema(require('../schemas/tag-result.json'), 'tag-result');


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
        object.location = removeMultipleSpace(result.subhead).trim();
        break;
      case 'album':
        // album's specific properties
        object = assignProps(result, object, ['releaseDate', 'numTracks', 'numMinutes']);
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
            object.album = removeNewLine(info[0]).replace('location', '').replace(/^from /, '')
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

// parse tag results
exports.parseTagResults = function (html) {
  var $ = cheerio.load(html);
  var data = scrapeIt.scrapeHTML($, {
    results: {
      listItem: ".item_list .item",
      data: {
        name: { selector: ".itemtext" },
        artist: { selector: ".itemsubtext" },
        url: { selector: "a", attr: "href" }
      }
    }
  });
  return data.results.reduce(function (results, result) {
    var object = assignProps(result, {}, ['name', 'artist', 'url']);
    if (ajv.validate('tag-result', object)) {
      results.push(object);
    } else {
      console.error('Validation error on tag result: ', ajv.errorsText(), object, ajv.errors);
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


exports.extractJavascriptObjectVariable = function (html, variableName) {
  var regex = new RegExp('var ' + variableName + '\\s*=\\s*(\\{[\\s\\S]*?\\})\\s*;');
  var matches = html.match(regex);
  if (matches && matches.length == 2) {
    return matches[1];
  }
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
        tags: {
          listItem: ".tag",
          data: {
            name: {
              convert: function (tag) {
                return tag;
              }
            }
          }
        },
        tracks: {
          listItem: 'table#track_table tr.track_row_view',
          data: {
            name: {
              selector: 'span[itemprop=name]'
            },
            url: {
              selector: 'a[itemprop=url]',
              attr: 'href',
              convert: function (href) {
                if (!href) return null
                return urlHelper.resolve(albumUrl, href)
              }
            },
            duration: {
              selector: '.time',
              convert: function (duration) {
                if (!duration) return null
                return duration
              }
            }
          }
        }
      }
    }
  });
  var object = assignProps(data.album, {}, ['tags', 'artist', 'title', 'imageUrl', 'tracks']);
  // Remove undefined/null properties.
  for (var i = 0; i < object.tracks.length; i++) {
    // Remove tracks properties.
    for (var key in object.tracks[i]) {
      if (object.tracks[i].hasOwnProperty(key)) {
        if (!object.tracks[i][key])
        delete object.tracks[i][key]
      }
    }
  }
  var raw = this.extractJavascriptObjectVariable(html, 'TralbumData');
  // The only javascript in the variable is the concatenation of the base url
  // with the current album path. We nned to do it yourself.
  // Ex:
  //  url: "http://musique.coeurdepirate.com" + "/album/blonde",
  raw = raw ? raw.replace('" + "', '') : ''
  try {
    object.raw = JSON5.parse(raw);
  } catch (error) {
    console.error(error);
  }
  object.url = albumUrl;
  // validate through JSON schema
  if (ajv.validate('album-info', object)) {
    return object;
  } else { // TODO add a flag to log only when debugging
    console.error('Validation error on album info: ', ajv.errorsText(), object);
    return null;
  }
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
    // artist
    object.artist = albumInfo.artist;
    // validate through JSON schema
    if (ajv.validate('album-product', object)) {
      products.push(object)
    } else { // TODO add a flag to log only when debugging
      console.error('Error: ', ajv.errorsText(), object, JSON.stringify(ajv.errors));
    }
    return products;
  }, []);
};
