/* eslint-env jasmine */

const bandcamp = require('./../lib/index.js')

jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000

const artists = [
  'bonobomusic',
  'Giraffage',
  'Cœur de pirate',
  'Tiger Jazz Club',
  'Mac DeMarco',
  'Faded Paper Figures'
]

const artistUrls = [
  'http://musique.coeurdepirate.com',
  'https://macdemarco.bandcamp.com',
  'https://fadedpaperfigures.bandcamp.com',
  'https://tigerjazzclub.bandcamp.com',
  'https://bonobomusic.bandcamp.com',
  'https://giraffage.bandcamp.com'
]

const albumUrls = [
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
  'http://musique.coeurdepirate.com/album/blonde',
  'http://musique.coeurdepirate.com/album/coeur-de-pirate',
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
  'https://macdemarco.bandcamp.com/album/another-one',
  'https://macdemarco.bandcamp.com/album/salad-days',
  'https://macdemarco.bandcamp.com/album/2',
  'https://macdemarco.bandcamp.com/album/rock-and-roll-night-club-2',
  'https://fasterthanmusic.bandcamp.com/album/pr4kaneokastrna-ep'
]

const labelsUrls = [
  'https://planetmu.bandcamp.com',
  'https://randsrecords.bandcamp.com'
]

function sample (array) {
  const index = Math.floor(Math.random() * array.length)
  return array[index]
}

describe('bandcamp-scraper', function () {
  describe('search', function () {
    it('scrape search results', function (done) {
      const artist = sample(artists)
      expect(
        bandcamp.search({ query: artist }, function (error, searchResults) {
          console.log('artist', artist)
          if (error) console.log('error', error)
          if (searchResults) console.log('searchResults', searchResults)
          expect(error).toBeNull()
          expect(Array.isArray(searchResults)).toBe(true)
          expect(searchResults.length).toBeGreaterThan(0)
          done()
          // TODO validate with JSON schema
        })
      )
    })
  })

  describe('getAlbumUrls', function () {
    it('scrape album urls', function (done) {
      const artistUrl = sample(artistUrls)
      expect(
        bandcamp.getAlbumUrls(artistUrl, function (error, albumUrls) {
          console.log('artistUrl', artistUrl)
          if (error) console.log('error', error)
          if (albumUrls) console.log('albumUrls', albumUrls)
          expect(error).toBeNull()
          expect(Array.isArray(albumUrls)).toBe(true)
          expect(albumUrls.length).toBeGreaterThan(0)
          done()
          // TODO validate with JSON schema
        })
      )
    })
  })

  describe('getAlbumInfo', function () {
    it('scrape album info', function (done) {
      const albumUrl = sample(albumUrls)
      expect(
        bandcamp.getAlbumInfo(albumUrl, function (error, albumInfo) {
          console.log('albumUrl', albumUrl)
          if (error) console.log('error', error)
          if (albumInfo) console.log('albumInfo', albumInfo)
          expect(error).toBeNull()
          expect(albumInfo).not.toBeNull()
          expect(typeof albumInfo).toEqual('object')
          done()
          // TODO validate with JSON schema
        })
      )
    })
  })

  describe('getAlbumProducts', function () {
    it('scrape album products', function (done) {
      const albumUrl = sample(albumUrls)
      expect(
        bandcamp.getAlbumProducts(albumUrl, function (error, albumProducts) {
          console.log('albumUrl', albumUrl)
          if (error) console.log('error', error)
          if (albumProducts) console.log('albumProducts', albumProducts)
          expect(error).toBeNull()
          expect(Array.isArray(albumProducts)).toBe(true)
          expect(albumProducts.length).toBeGreaterThan(0)
          done()
          // TODO validate with JSON schema
        })
      )
    })
  })

  describe('getArtistsUrls', function () {
    it('scrape artist urls for a label', function (done) {
      const labelUrl = sample(labelsUrls)
      expect(
        bandcamp.getArtistUrls(labelUrl, function (error, artistsUrl) {
          console.log('artistUrl', artistsUrl)
          if (error) console.log('error', error)
          if (artistsUrl) console.log('artistsUrl', artistsUrl)
          expect(error).toBeNull()
          expect(Array.isArray(artistsUrl)).toBe(true)
          expect(artistsUrl.length).toBeGreaterThan(0)
          done()
          // TODO validate with JSON schema
        })
      )
    })
  })
})
