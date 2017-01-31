var bandcamp = require('./../lib/index.js');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;

var artists = [
  'Bonobo',
  'Giraffage',
  'Cœur de pirate',
  'Tiger Jazz Club',
  'Mac DeMarco',
  'deadmau5',
  'Faded Paper Figures'
];

var artistUrls = [
  'http://musique.coeurdepirate.com',
  'https://macdemarco.bandcamp.com',
  'https://fadedpaperfigures.bandcamp.com',
  'https://tigerjazzclub.bandcamp.com',
  'https://bonobomusic.bandcamp.com',
  'https://giraffage.bandcamp.com'
];

var albumUrls = [
  'https://bonobomusic.bandcamp.com/album/migration',
  'https://bonobomusic.bandcamp.com/album/les-l-bas-bonobo-remix',
  'https://bonobomusic.bandcamp.com/album/flashlight-ep',
  'https://bonobomusic.bandcamp.com/album/the-north-borders-tour-live',
  'https://bonobomusic.bandcamp.com/album/ten-tigers',
  'https://bonobomusic.bandcamp.com/album/the-north-borders-2',
  'https://bonobomusic.bandcamp.com/album/black-sands-remixed',
  'https://bonobomusic.bandcamp.com/album/black-sands',
  'https://bonobomusic.bandcamp.com/album/days-to-come',
  'https://bonobomusic.bandcamp.com/album/dial-m-for-monkey',
  'http://musique.coeurdepirate.com/album/roses',
  'http://musique.coeurdepirate.com/album/carry-on-2',
  'http://musique.coeurdepirate.com/album/oublie-moi-carry-on',
  'http://musique.coeurdepirate.com/album/child-of-light',
  'http://musique.coeurdepirate.com/album/trauma',
  'http://musique.coeurdepirate.com/album/blonde',
  'http://musique.coeurdepirate.com/album/coeur-de-pirate',
  'http://musique.coeurdepirate.com/album/comme-des-enfants-version-originale-et-remix-par-le-matos',
  'http://musique.coeurdepirate.com/album/chansons-tristes-pour-no-l',
  'https://giraffage.bandcamp.com/album/needs',
  'https://giraffage.bandcamp.com/album/comfort',
  'https://giraffage.bandcamp.com/album/pretty-things-ep',
  'https://tigerjazzclub.bandcamp.com/album/cr-me-d-lice',
  'https://tigerjazzclub.bandcamp.com/album/tiger-jazz-club',
  'https://fadedpaperfigures.bandcamp.com/album/chronos',
  'https://fadedpaperfigures.bandcamp.com/album/remnants-ep',
  'https://fadedpaperfigures.bandcamp.com/album/relics',
  'https://fadedpaperfigures.bandcamp.com/album/the-matter',
  'https://fadedpaperfigures.bandcamp.com/album/new-medium',
  'https://fadedpaperfigures.bandcamp.com/album/dynamo',
  'https://deadmau5live.bandcamp.com/album/w-2016album',
  'https://macdemarco.bandcamp.com/album/another-one',
  'https://macdemarco.bandcamp.com/album/salad-days',
  'https://macdemarco.bandcamp.com/album/2',
  'https://macdemarco.bandcamp.com/album/rock-and-roll-night-club-2'
];


function sample(array) {
  var index = Math.floor(Math.random() * (array.length));
  return array[index];
}


describe("bandcamp-scraper", function () {

  describe("search", function () {
    it("scrape search results", function (done) {
      var artist = sample(artists);
      console.log('artist', artist);
      expect(bandcamp.search({query: artist}, function (error, searchResults) {
        expect(error).toBeNull();
        expect(Array.isArray(searchResults)).toBe(true);
        expect(searchResults.length).toBeGreaterThan(0);
        done();
      }));
    });
  });

  describe("getAlbumUrls", function () {
    it("scrape album urls", function (done) {
      var artistUrl = sample(artistUrls);
      console.log('artistUrl', artistUrl);
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
      var albumUrl = sample(albumUrls);
      console.log('albumUrl', albumUrl);
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
      var albumUrl = sample(albumUrls);
      console.log('albumUrl', albumUrl);
      expect(bandcamp.getAlbumProducts(albumUrl, function (error, albumProducts) {
        expect(error).toBeNull();
        expect(Array.isArray(albumProducts)).toBe(true);
        expect(albumProducts.length).toBeGreaterThan(0);
        done();
      }));
    });
  });

});
