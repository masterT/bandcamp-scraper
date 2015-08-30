# bandcamp-scraper

[![NPM version](https://img.shields.io/npm/v/bandcamp-scraper.svg?style=flat-square)](https://npmjs.org/package/bandcamp-scraper)
[![Dependency Status](https://gemnasium.com/masterT/bandcamp-scraper.svg)](https://gemnasium.com/masterT/bandcamp-scraper)

It is a scraper for [bandcamp.com](https://bandcamp.com/) that allows you to:

- search anything (artist, album, track, fan) by keywords
- get all album URLs from an artist URL
- get all products from an album URL


#### Why ?

Because the Bandcamp's API is no longer supported and Bandcamp is not granting any new developer keys.

[https://bandcamp.com/developer](https://bandcamp.com/developer)


## Installation

`npm install bandcamp-scraper`

## Usage

Require library

```js
var bandcamp = require('bandcamp-scraper');
```

### Search

```js
bandcamp.search({
	query: 'Coeur de pirate',
	page: 1
}, function(error, results) {
  if (error) {
    console.log(error);
  } else {
    console.log(results);
  }
});
```

#### Query Params

- **query**: keywords (required)
- **page**: results page (default: 1)

#### Results

An array of Object that have different properties depending on the type.

- **artist**
	- type: String
	- name: String
	- link: String
	- image: String
	- tags: Array
	- genre: String
	- from: String


- **album**
	- type: String
	- name: String
	- link: String
	- image: String
	- tags: Array
	- releaseDate: String
	- artist: String
	- numTracks: Integer
	- numMinutes: Integer

- **track**
	- type: String
	- name: String
	- link: String
	- image: String
	- tags: Array
	- releaseDate: String
	- album: String
	- artist: String

- **fan**
	- type: String
	- name: String
	- link: String
	- image: String
	- tags: Array
	- genre: String


### Get albums URL

```js
var artistURL = "http://musique.coeurdepirate.com/";
bandcamp.getArtistAlbumURLs(artistURL, function(error, results) {
  if (error) {
    console.log(error);
  } else {
    console.log(results);
  }
});
```

#### Results

An array of URL for each album of the artist.


### Get album's products

```js
var albumURL = "http://musique.coeurdepirate.com/album/blonde";
bandcamp.getAlbumProducts(albumURL, function(error, results) {
  if (error) {
    console.log(error);
  } else {
    console.log(results);
  }
});
```

#### Results

An array of URL of Object that represent a product related to the album.

**Product properties**

- name: String
- description: String
- format: String
- priceInCents: Integer
- currency: String (3 letters)
- nameYourPrice: Boolean
- orMore: Boolean
- soldOut: Boolean
- numRemaining: Integer (null if there is no remaning count)



## Test

TODO: write some tests

## Contributing

Contribution is welcome! Open an issue first.

## License

MIT.
