var bandcamp = require('./../lib/index.js');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;


describe("bandcamp-scraper", function () {

  describe("search", function () {
    it("scrape search results", function (done) {
      var params = {
        query: 'giraffage'
      };
      expect(bandcamp.search(params, function (error, searchResults) {
        expect(error).toBeNull();
        expect(Array.isArray(searchResults)).toBe(true);
        expect(searchResults.length).toBeGreaterThan(0);
        done();
      }));
    });
  });

  describe("getAlbumUrls", function () {
    it("scrape album urls", function (done) {
      var artistUrl = 'http://musique.coeurdepirate.com/';
      expect(bandcamp.getAlbumUrls(artistUrl, function (error, albumUrls) {
        expect(error).toBeNull();
        expect(Array.isArray(albumUrls)).toBe(true);
        expect(albumUrls.length).toBeGreaterThan(0);
        done();
      }));
    });
  });

  describe("getAlbumInfo", function () {
    it("scrape album info", function (done) {
      var albumUrl = 'http://musique.coeurdepirate.com/album/blonde';
      expect(bandcamp.getAlbumInfo(albumUrl, function (error, albumInfo) {
        expect(error).toBeNull();
        expect(albumInfo).not.toBeNull();
        expect(typeof albumInfo).toEqual('object');
        var propNames = ["artist", "title", "imageUrl", "tracks", "raw"];
        propNames.forEach(function (propName) {
          expect(albumInfo[propName]).toBeDefined();
        })
        done();
      }));
    });
  });

  describe("getAlbumProducts", function () {
    it("scrape album products", function (done) {
      var albumUrl = 'http://musique.coeurdepirate.com/album/blonde';
      expect(bandcamp.getAlbumProducts(albumUrl, function (error, albumProducts) {
        expect(error).toBeNull();
        expect(Array.isArray(albumProducts)).toBe(true);
        expect(albumProducts.length).toBeGreaterThan(0);
        done();
      }));
    });
  });

});
