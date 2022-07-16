const cheerio = require('cheerio')
const scrapeIt = require('scrape-it')
const urlHelper = require('url')
const linez = require('linez')
const Ajv = require('ajv')
const JSON5 = require('json5')

// add search-result Schema
const ajv = new Ajv()
ajv.addSchema(require('../schemas/search-result.json'), 'search-result')
ajv.addSchema(require('../schemas/album-product.json'), 'album-product')
ajv.addSchema(require('../schemas/album-info.json'), 'album-info')
ajv.addSchema(require('../schemas/tag-result.json'), 'tag-result')

linez.configure({
  newlines: ['\n', '\r\n', '\r']
})

const removeMultipleSpace = function (text) {
  return text.replace(/\s{2,}/g, ' ')
}

const removeNewLine = function (text) {
  text = linez(text).lines.map(function (line) {
    return line.text.trim()
  }).join(' ')
  return removeMultipleSpace(text)
}

const assignProps = function (objFrom, objTo, propNames) {
  propNames.forEach(function (propName) {
    objTo[propName] = objFrom[propName]
  })
  return objTo
}

// parse search results
exports.parseSearchResults = function (html) {
  const $ = cheerio.load(html)
  const data = scrapeIt.scrapeHTML($, {
    results: {
      listItem: '.result-items li',
      data: {
        type: {
          selector: '.itemtype',
          convert: function (text) {
            return text.toLowerCase()
          }
        },
        name: { selector: '.heading' },
        url: { selector: '.itemurl' },
        imageUrl: { selector: '.art img', attr: 'src' },
        tags: {
          selector: '.tags',
          convert: function (text) {
            const tags = text.replace('tags:', '').replace(/\s/g, '')
            return tags.length > 1 ? tags.split(',') : []
          }
        },
        genre: {
          selector: '.genre',
          convert: function (text) {
            return removeMultipleSpace(text.replace('genre:', ''))
          }
        },
        subhead: {
          selector: '.subhead',
          convert: function (text) {
            return removeMultipleSpace(text)
          }
        },
        releaseDate: {
          selector: '.released',
          convert: function (text) {
            return text.replace('released ', '')
          }
        },
        numTracks: {
          selector: '.length',
          convert: function (text) {
            const info = text.split(',')
            if (info.length === 2) {
              return parseInt(info[0].replace(' tracks', ''))
            }
          }
        },
        numMinutes: {
          selector: '.length',
          convert: function (text) {
            const info = text.split(',')
            if (info.length === 2) {
              return parseInt(info[1].replace(' minutes', ''))
            }
          }
        }
      }
    }
  })
  return data.results.reduce(function (results, result) {
    // basic properties
    let object = assignProps(result, {}, ['type', 'name', 'url', 'imageUrl', 'tags'])
    // specific properties
    switch (result.type) {
      case 'artist':
        // genre
        object.genre = result.genre
        // location
        object.location = removeMultipleSpace(result.subhead).trim()
        break
      case 'album':
        // album's specific properties
        object = assignProps(result, object, ['releaseDate', 'numTracks', 'numMinutes'])
        // artist
        object.artist = result.subhead.replace('by ', '').trim()
        break
      case 'track':
        // released date
        object.releaseDate = result.releaseDate
        //  album & artist
        if (result.subhead) {
          const info = result.subhead.trim().split(' by ')
          if (info.length > 0) {
            object.album = removeNewLine(info[0]).replace('location', '').replace(/^from /, '')
            info.shift()
            object.artist = removeNewLine(info.join(' by '))
          }
        }
        break
      case 'fan':
        // genre
        object.genre = result.genre
        break
    }
    // validate through JSON schema
    if (ajv.validate('search-result', object)) {
      results.push(object)
    } else { // TODO add a flag to log only when debugging
      console.error('Validation error on search result: ', ajv.errorsText(), object, ajv.errors)
    }
    return results
  }, [])
}

exports.extractAlbumUrlsFromDataBlob = function(html){
  const $ = cheerio.load(html)
  const data = scrapeIt.scrapeHTML($, {
    data: {
      selector: '#pagedata',
      attr: 'data-blob'
    }
  });

  const json_raw = JSON5.parse(data.data)
  const albums = []
  for (const collection of json_raw.hub.tabs[0].collections) {
    for (const item of collection.items) {
      const album = {
        name: item.title,
        artist: item.artist,
        url: item.tralbum_url,
        artist_url: item.band_url
      }
      albums.push(album)
    }
  }
  return albums
}

// parse tag results
exports.parseTagResults = function (html) {
  const $ = cheerio.load(html)


  const data = { results: this.extractAlbumUrlsFromDataBlob(html) }

  return data.results.reduce(function (results, result) {
    const object = assignProps(result, {}, ['name', 'artist', 'url', 'artist_url'])
    if (ajv.validate('tag-result', object)) {
      results.push(object)
    } else {
      console.error('Validation error on tag result: ', ajv.errorsText(), object, ajv.errors)
    }
    return results
  }, [])
}

// parse album urls
exports.parseAlbumUrls = function (html, artistUrl) {
  const $ = cheerio.load(html)
  const data = scrapeIt.scrapeHTML($, {
    albumLinks: {
      listItem: 'a',
      data: {
        url: {
          attr: 'href',
          convert: function (href) {
            if (/^\/(track|album)\/(.+)$/.exec(href)) {
              return new urlHelper.URL(href, artistUrl).toString()
            }
          }
        }
      }
    }
  })
  return data.albumLinks.reduce(function (albumUrls, albumLink) {
    const url = albumLink.url
    if (url) {
      if (albumUrls.indexOf(url) === -1) {
        albumUrls.push(url)
      }
    }
    return albumUrls
  }, [])
}

exports.parseArtistUrls = function (html, labelUrl) {
  const $ = cheerio.load(html)
  const data = scrapeIt.scrapeHTML($, {
    artistLinks: {
      listItem: 'a',
      data: {
        url: {
          attr: 'href',
          convert: function (href) {
            if (/tab=artists*$/.exec(href)) {
              return new urlHelper.URL(href, labelUrl).toString()
            }
          }
        }
      }
    }
  })

  return data.artistLinks.reduce(function (artistUrls, artistLink) {
    const url = artistLink.url
    if (url) {
      if (artistUrls.indexOf(url) === -1) {
        artistUrls.push(url)
      }
    }
    return artistUrls
  }, [])
}

exports.extractJavascriptObjectVariable = function (html, variableName) {
  const regex = new RegExp('var ' + variableName + '\\s*=\\s*(\\{[\\s\\S]*?\\})\\s*;')
  const matches = html.match(regex)
  if (matches && matches.length === 2) {
    return matches[1]
  }
}

// parse album info
exports.parseAlbumInfo = function (html, albumUrl) {
  const $ = cheerio.load(html)
  const data = scrapeIt.scrapeHTML($, {
    album: {
      selector: 'body',
      data: {
        artist: { selector: '#name-section span' },
        title: { selector: '#name-section .trackTitle' },
        imageUrl: {
          selector: '#tralbumArt img',
          attr: 'src',
          convert: function (src) {
            if (src) {
              return src.replace(/_\d{1,3}\./, '_2.') // use small version
            }
          }
        },
        tags: {
          listItem: '.tag',
          data: {
            name: {
              convert: function (tag) {
                return tag
              }
            }
          }
        },
        tracks: {
          listItem: 'table#track_table tr.track_row_view',
          data: {
            name: {
              selector: 'span.track-title'
            },
            url: {
              selector: '.info_link a',
              attr: 'href',
              convert: function (href) {
                if (!href) return null
                return new urlHelper.URL(href, albumUrl).toString()
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
        },
        nonPlayableTracks: {
          listItem: 'table#track_table tr.track_row_view',
          data: {
            name: {
              selector: '.title>span:not(.time)'
            }
          }
        }
      }
    }
  })

  for (const nonPlayableTrack of data.album.nonPlayableTracks) {
    data.album.tracks.push(nonPlayableTrack)
  };

  const object = assignProps(data.album, {}, ['tags', 'artist', 'title', 'imageUrl', 'tracks'])
  // Remove undefined/null properties.

  // remove non-playable tracks that would have been caught in "tracks" (in case of preview albums)
  object.tracks = object.tracks.filter(x => x.name !== '')

  for (let i = 0; i < object.tracks.length; i++) {
    // Remove tracks properties.
    for (const key in object.tracks[i]) {
      if (Object.prototype.hasOwnProperty.call(object.tracks[i], key)) {
        if (!object.tracks[i][key]) { delete object.tracks[i][key] }
      }
    }
  }
  // Parse raw.
  const scriptWithRaw = $('script[data-tralbum]')
  if (scriptWithRaw.length > 0) {
    object.raw = scriptWithRaw.data('tralbum')
  } else {
    let raw = this.extractJavascriptObjectVariable(html, 'TralbumData')
    // The only javascript in the variable is the concatenation of the base url
    // with the current album path. We nned to do it yourself.
    // Ex:
    //  url: "http://musique.coeurdepirate.com" + "/album/blonde",
    raw = raw ? raw.replace('" + "', '') : ''
    try {
      object.raw = JSON5.parse(raw)
    } catch (error) {
      console.error(error)
    }
  }

  object.url = albumUrl
  // validate through JSON schema
  if (ajv.validate('album-info', object)) {
    return object
  } else { // TODO add a flag to log only when debugging
    console.error('Validation error on album info: ', ajv.errorsText(), object)
    return null
  }
}

exports.parseArtistInfo = function (html, artistUrl) {
  const $ = cheerio.load(html)
  const data = scrapeIt.scrapeHTML($, {
    name: '#band-name-location .title',
    location: '#band-name-location .location',
    coverImage: {
      selector: '.bio-pic a',
      attr: 'href'
    },
    description: 'p#bio-text',
    albums: {
      listItem: '.music-grid-item',
      data: {
        url: {
          selector: 'a',
          attr: 'href',
          convert: href => artistUrl + href
        },
        coverImageSrc: {
          selector: 'img',
          attr: 'src'
        },
        coverImageOriginal: {
          selector: 'img',
          attr: 'data-original'
        },
        title: '.title'
      }
    },
    discographyAlbums: {
      listItem: '#discography ul li',
      data: {
        url: {
          selector: 'a',
          attr: 'href',
          convert: href => artistUrl + href
        },
        coverImage: {
          selector: 'img',
          attr: 'src'
        },
        title: '.trackTitle a'
      }
    },
    shows: {
      listItem: '#showography ul li',
      data: {
        date: '.showDate',
        venue: '.showVenue a',
        venueUrl: {
          selector: '.showVenue a',
          attr: 'href'
        },
        location: '.showLoc'
      }
    },
    bandLinks: {
      listItem: '#band-links li',
      data: {
        name: 'a',
        url: {
          selector: 'a',
          attr: 'href'
        }
      }
    }
  })

  const mapAlbums = album => ({
    url: album.url,
    title: album.title,
    coverImage: album.coverImageOriginal || album.coverImageSrc
  })

  const albums = data.albums.map(mapAlbums)
  const mergedAlbums = [...new Set([...albums, ...data.discographyAlbums])]

  return {
    name: data.name,
    location: data.location,
    description: data.description,
    coverImage: data.coverImage,
    albums: mergedAlbums,
    shows: data.shows,
    bandLinks: data.bandLinks
  }
}

// parse album products
exports.parseAlbumProducts = function (html, albumUrl) {
  const albumInfo = this.parseAlbumInfo(html, albumUrl)
  const $ = cheerio.load(html)
  const data = scrapeIt.scrapeHTML($, {
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
        nameFallback: { // fallback
          selector: '.hd.lowHeadroom',
          convert: removeNewLine
        },
        format: {
          selector: '.buyItemPackageTitle'
        },
        formatFallback: { // fallback
          selector: '.merchtype'
        },
        priceInCents: {
          selector: '.ft span.base-text-color',
          convert: function (text) {
            const matches = text.match(/(\d+)([.,]?)(\d{0,2})/)
            if (matches) {
              return parseInt(matches[1] + (matches[3] || '00'))
            } else {
              return null
            }
          }
        },
        // currency
        currency: {
          selector: '.ft span.secondaryText',
          eq: 0
        },
        offerMore: {
          selector: '.ft span.secondaryText',
          eq: 1,
          convert: function (text) {
            return text.toLowerCase() === 'or more'
          }
        },
        soldOut: {
          selector: '.notable',
          convert: function (text) {
            return text.toLowerCase() === 'sold out'
          }
        },
        nameYourPrice: {
          selector: '.ft span.secondaryText',
          convert: function (text) {
            return text.toLowerCase() === 'name your price'
          }
        },
        description: {
          selector: '.bd',
          convert: function (text) {
            return removeNewLine(text.trim())
          }
        }
      }
    }
  })
  return data.products.reduce(function (products, product) {
    // basic properties
    const object = assignProps(product, {}, ['description', 'soldOut', 'nameYourPrice', 'offerMore', 'nameYourPrice'])
    // url
    object.url = albumUrl
    // format
    object.format = product.format || product.formatFallback || 'Other'
    // name
    if (object.format.match(/digital\s(track|album)/i)) {
      // digital have a different name
      object.name = albumInfo.title
    } else {
      object.name = product.name || product.nameFallback
    }
    // imageUrls
    if (product.imageUrls.length === 0) {
      object.imageUrls = [albumInfo.imageUrl]
    } else {
      object.imageUrls = product.imageUrls.map(function (imageUrl) {
        return imageUrl.url
      })
    }
    // price
    if (product.soldOut) {
      object.priceInCents = null
      object.currency = null
    } else if (product.nameYourPrice) {
      object.priceInCents = 0
      object.currency = null
    } else {
      object.priceInCents = product.priceInCents
      object.currency = product.currency
    }
    // artist
    object.artist = albumInfo.artist
    // validate through JSON schema
    if (ajv.validate('album-product', object)) {
      products.push(object)
    } else { // TODO add a flag to log only when debugging
      console.error('Error: ', ajv.errorsText(), object, JSON.stringify(ajv.errors))
    }
    return products
  }, [])
}
