var req         = require("tinyreq"),
    urlHelper   = require('url'),
    htmlParser  = require('./htmlParser.js'),
    utils       = require('./utils.js');


exports.search = function (params, cb) {
  var url = utils.generateSearchUrl(params);
  req(url, function (error, html) {
    if (error) {
      cb(error, null);
    } else {
      var searchResults = htmlParser.parseSearchResults(html);
      cb(null, searchResults);
    }
  });
};


exports.tag = function (params, cb) {
  var url = utils.generateTagUrl(params);
  req(url, function (error, html) {
    if (error) {
      cb(error, null);
    } else {
      var tagResults = htmlParser.parseTagResults(html);
      cb(null, tagResults);
    }
  });
};


exports.getAlbumUrls = function (artistUrl, cb) {
  artistUrl = urlHelper.resolve(artistUrl, '/music');
  req(artistUrl, function (error, html) {
    if (error) {
      cb(error, null);
    } else {
      var albumUrls = htmlParser.parseAlbumUrls(html, artistUrl);
      cb(null, albumUrls);
    }
  });
};


exports.getAlbumInfo = function (albumUrl, cb) {
  req(albumUrl, function (error, html) {
    if (error) {
      cb(error, null);
    } else {
      var albumInfo = htmlParser.parseAlbumInfo(html, albumUrl);
      cb(null, albumInfo);
    }
  });
};


exports.getAlbumProducts = function (albumUrl, cb) {
  req(albumUrl, function (error, html) {
    if (error) {
      cb(error, null);
    } else {
      var products = htmlParser.parseAlbumProducts(html, albumUrl);
      cb(null, products);
    }
  });
};
