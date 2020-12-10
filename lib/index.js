const req = require('tinyreq')
const urlHelper = require('url')
const htmlParser = require('./htmlParser.js')
const utils = require('./utils.js')

exports.search = function (params, cb) {
  const url = utils.generateSearchUrl(params)
  req(url, function (error, html) {
    if (error) {
      cb(error, null)
    } else {
      const searchResults = htmlParser.parseSearchResults(html)
      cb(null, searchResults)
    }
  })
}

exports.getAlbumsWithTag = function (params, cb) {
  const url = utils.generateTagUrl(params)
  req(url, function (error, html) {
    if (error) {
      cb(error, null)
    } else {
      const tagResults = htmlParser.parseTagResults(html)
      cb(null, tagResults)
    }
  })
}

exports.getAlbumUrls = function (artistUrl, cb) {
  artistUrl = new urlHelper.URL('/music', artistUrl).toString()
  req(artistUrl, function (error, html) {
    if (error) {
      cb(error, null)
    } else {
      const albumUrls = htmlParser.parseAlbumUrls(html, artistUrl)
      cb(null, albumUrls)
    }
  })
}

exports.getAlbumInfo = function (albumUrl, cb) {
  req(albumUrl, function (error, html) {
    if (error) {
      cb(error, null)
    } else {
      const albumInfo = htmlParser.parseAlbumInfo(html, albumUrl)
      cb(null, albumInfo)
    }
  })
}

exports.getAlbumProducts = function (albumUrl, cb) {
  req(albumUrl, function (error, html) {
    if (error) {
      cb(error, null)
    } else {
      const products = htmlParser.parseAlbumProducts(html, albumUrl)
      cb(null, products)
    }
  })
}

exports.getArtistUrls = function (labelUrl, cb) {
  labelUrl = new urlHelper.URL('/artists', labelUrl).toString()
  req(labelUrl, function (error, html) {
    if (error) {
      cb(error, null)
    } else {
      const artistUrls = htmlParser.parseArtistUrls(html, labelUrl)
      cb(null, artistUrls)
    }
  })
}
