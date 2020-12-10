# bandcamp-scraper

[![npm version](https://badge.fury.io/js/bandcamp-scraper.svg)](https://badge.fury.io/js/bandcamp-scraper)
![Test](https://github.com/masterT/bandcamp-scraper/workflows/Test/badge.svg?event=push)
![Test daily](https://github.com/masterT/bandcamp-scraper/workflows/Test/badge.svg?event=schedule)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

[![Bandcamp Logo](assets/bandcamp.png)](https://bandcamp.com)

> A scraper for https://bandcamp.com

The scraper allows you to:

- search `artist`, `album`, `track`, `fan`, `label`
- get album urls from an artist url
- get album info from an album url
- get album products from an album url

#### Why ?

Because Bandcamp has shut down their public API and don't plan to reopen it.

[https://bandcamp.com/developer](https://bandcamp.com/developer)

## Installation

```bash
npm i --save bandcamp-scraper
```

## Usage

### `search(params, callback)`

Search any resources that match the given `params.query` for the current `params.page`.

- params _Object_ - query _String_ - page _Integer_ (default `1`)
- callback _Function(error, searchResults)_

#### Search Results

An array of resources that have different properties depending on their _type_ property: **artist**, **album**, **track**, **fan**, or **label**.

Every resource matches the [search-result JSON schema](/schemas/search-result.json).

#### Example

```js
const bandcamp = require('bandcamp-scraper')

const params = {
  query: 'Coeur de pirate',
  page: 1
}

bandcamp.search(params, function (error, searchResults) {
  if (error) {
    console.log(error)
  } else {
    console.log(searchResults)
  }
})
```

[View example with output](examples/search.js).

### `getAlbumsWithTag(params, callback)`

Search for albums with the tag `params.tag` for the current `params.page`.

- params _Object_ - tag _String_ - page _Integer_ (default `1`)
- callback _Function(error, tagResults)_

#### Tag Results

An array of album information. Matches the [tag-result JSON schema](/schemas/tag-result.json).

#### Example

```js
const bandcamp = require('bandcamp-scraper')

const params = {
  tag: 'nuwrld',
  page: 1
}

bandcamp.getAlbumsWithTag(params, function (error, tagResults) {
  if (error) {
    console.log(error)
  } else {
    console.log(tagResults)
  }
})
```

[View example with output](examples/tag.js).

### `getAlbumUrls(artistUrl, callback)`

Retrieve the album URLs from an artist URL.
Please note: for Bandcamp labels you may want to use the `getArtistsUrls` function to retrieve the list of signed artists first.

- artistUrl _String_
- callback _Function(error, albumUrls)_

#### Example

```js
const bandcamp = require('bandcamp-scraper')

const artistUrl = 'http://musique.coeurdepirate.com/'
bandcamp.getAlbumUrls(artistUrl, function (error, albumUrls) {
  if (error) {
    console.log(error)
  } else {
    console.log(albumUrls)
  }
})
```

[View example with output](examples/getAlbumUrls.js).

### `getAlbumProducts(albumUrl, callback)`

Retrieves all the album's products from its URL.

- albumUrl _String_
- callback _Function(error, albumProducts)_

#### Album Products

An array of album products that matches the [album-product JSON schema](/schemas/album-product.json).

#### Example

```js
const bandcamp = require('bandcamp-scraper')

const albumUrl = 'http://musique.coeurdepirate.com/album/blonde'
bandcamp.getAlbumProducts(albumUrl, function (error, albumProducts) {
  if (error) {
    console.log(error)
  } else {
    console.log(albumProducts)
  }
})
```

[View example with output](examples/getAlbumProducts.js).

### `getAlbumInfo(albumUrl, callback)`

Retrieves the album's info from its URL.

- albumUrl _String_
- callback _Function(error, albumInfo)_

#### Album Info

An _Object_ that represents the album's info. It matches the [album-info JSON schema](/schemas/album-info.json).

#### Example

```js
const bandcamp = require('bandcamp-scraper')

const albumUrl = 'http://musique.coeurdepirate.com/album/blonde'
bandcamp.getAlbumInfo(albumUrl, function (error, albumInfo) {
  if (error) {
    console.log(error)
  } else {
    console.log(albumInfo)
  }
})
```

[View example with output](examples/getAlbumInfo.js).

### `getArtistUrls(labelUrl, callback)`

Retrieves an array of artist URLs from a label's URL for further scraping.

- labelUrl _String_
- callback _Function(error, albumInfo)_

#### Example

```js
const bandcamp = require('bandcamp-scraper')

const labelUrl = 'https://randsrecords.bandcamp.com'
bandcamp.getArtistUrls(labelUrl, function (error, artistsUrls) {
  if (error) {
    console.log(error)
  } else {
    console.log(artistsUrls)
  }
})
```

[View example with output](examples/getArtistUrls.js).

## Test

Feature tests are run _daily_, thanks to [GitHub Action](https://docs.github.com/en/free-pro-team@latest/actions) schedule actions. This way we know if the scraper is ever broken.

Run the test:

```bash
npm test
```

## Contributing

Contribution is welcome! Open an issue first.

## License

MIT.
