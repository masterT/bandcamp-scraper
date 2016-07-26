var fs = require('fs');
var path = require('path');
var Ajv = require('ajv');
var htmlParser = require('./../lib/htmlParser.js');

// add search-result Schema
var ajv = new Ajv();
ajv.addSchema(require('../schemas/search-result.json'), 'search-result');
ajv.addSchema(require('../schemas/album-product.json'), 'album-product');
ajv.addSchema(require('../schemas/album-info.json'), 'album-info');

function fixture(filename) {
  var filepath = path.join(__dirname, 'fixtures', filename + '.html');
  return fs.readFileSync(filepath, {encoding: 'utf-8'});
}

var numberOfType = function (type, searchResults) {
  return searchResults.filter(function (searchResult) {
    return searchResult.type === type;
  }).length;
}

describe("htmlParser", function () {

  describe("parseSearchResults", function () {

    it("parse search results", function () {
      var html = fixture('search');
      var searchResults = htmlParser.parseSearchResults(html);
      expect(Array.isArray(searchResults)).toBe(true);
      expect(searchResults.length).toBe(16);
      expect(numberOfType('artist', searchResults)).toEqual(1);
      expect(numberOfType('album',  searchResults)).toEqual(2);
      expect(numberOfType('track',  searchResults)).toEqual(13);
      expect(numberOfType('fan',    searchResults)).toEqual(0);
      searchResults.forEach(function (searchResult) {
        expect(ajv.validate('search-result', searchResult)).toBe(true);
      });
    });

  });

  describe("parseAlbumUrls", function () {

    it("parse album urls", function () {
      var html = fixture('artist');
      var urls = htmlParser.parseAlbumUrls(html, 'http://musique.coeurdepirate.com/');
      expect(Array.isArray(urls)).toBe(true);
      expect(urls.length).toBe(8);
    });

  });

  describe("parseAlbumInfo", function () {

    it("parse album info", function () {
      var html = fixture('album');
      var albumInfo = htmlParser.parseAlbumInfo(html, 'http://musique.coeurdepirate.com/album/blonde');
      expect(ajv.validate('album-info', albumInfo)).toBe(true);
    });

  });

  describe("parseAlbumProducts", function () {

    it("parse products from album page", function () {
      var html = fixture('album');
      var albumProducts = htmlParser.parseAlbumProducts(html, 'http://musique.coeurdepirate.com/album/blonde');
      expect(Array.isArray(albumProducts)).toBe(true);
      expect(albumProducts.length).toBe(13);
      albumProducts.forEach(function (product) {
        expect(ajv.validate('album-product', product)).toBe(true);
      });
    });

    it("parse products from track page", function () {
      var html = fixture('track');
      var albumProducts = htmlParser.parseAlbumProducts(html, 'http://musique.coeurdepirate.com/track/saint-laurent');
      expect(Array.isArray(albumProducts)).toBe(true);
      expect(albumProducts.length).toBe(13);
      albumProducts.forEach(function (product) {
        expect(ajv.validate('album-product', product)).toBe(true);
      });
    });

  });

});
