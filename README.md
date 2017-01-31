# bandcamp-scraper

[![Dependency Status](https://gemnasium.com/masterT/bandcamp-scraper.svg)](https://gemnasium.com/masterT/bandcamp-scraper)
[![TravisCI Status](https://travis-ci.org/masterT/bandcamp-scraper.svg)](https://travis-ci.org/masterT/bandcamp-scraper)

[![Bandcamp Logo](assets/bandcamp.png)](https://bandcamp.com)

> A scraper for https://bandcamp.com

The scraper allow you to:

- search `artist`, `album`, `track`, `fan`
- get album urls from an artist url
- get album info from an album url
- get album products from an album url


#### Why ?

Because Bandcamp has shut down there public API and don't plan to-reopen it.

[https://bandcamp.com/developer](https://bandcamp.com/developer)


## Installation

```bash
npm i --save bandcamp-scraper
```

## Usage

### `search(params, callback)`

Search any resources that matches the given `params.query` for the current `params.page`.

- params *Object*
	- query *String*
	- page *Integer* (default `1`)
- callback *Function(error, searchResults)*

#### Search Results

An array of resources that have different properties depending on their _type_ property: **artist**, **album**, **track** or **fan**.

Every resource matches the [search-result JSON schema](/schemas/search-result.json).

#### Example

```js
var bandcamp = require('bandcamp-scraper');

var params = {
  query: 'Coeur de pirate',
  page: 1
};

bandcamp.search(params, function(error, searchResults) {
  if (error) {
    console.log(error);
  } else {
    console.log(searchResults);
  }
});
```

[View example with output](examples/search.js).


### `getAlbumUrls(artistUrl, callback)`

Retrieve the album URLs from an artist URL.

- artistUrl *String*
- callback *Function(error, albumUrls)*

#### Example

```js
var bandcamp = require('bandcamp-scraper');

var artistUrl = 'http://musique.coeurdepirate.com/';
bandcamp.getAlbumUrls(artistUrl, function(error, albumUrls) {
  if (error) {
    console.log(error);
  } else {
    console.log(albumUrls);
  }
});
```

[View example with output](examples/getAlbumUrls.js).


### `getAlbumProducts(albumUrl, callback)`

Retrieves all the album's products of from its URL.

- albumUrl *String*
- callback *Function(error, albumProducts)*

#### Album Products

An array album products that matches the [album-product JSON schema](/schemas/album-product.json).

#### Example

```js
var bandcamp = require('bandcamp-scraper');

var albumUrl = 'http://musique.coeurdepirate.com/album/blonde';
bandcamp.getAlbumProducts(albumUrl, function(error, albumProducts) {
  if (error) {
    console.log(error);
  } else {
    console.log(albumProducts);
  }
});
```

[View example with output](examples/getAlbumProducts.js).


### `getAlbumInfo(albumUrl, callback)`

Retrieves the album's info of from its URL.

- albumUrl *String*
- callback *Function(error, albumInfo)*

#### Album Info

An *Object* that represents the album's info. It matches the [album-info JSON schema](/schemas/album-info.json).

#### Example

```js
var bandcamp = require('bandcamp-scraper');

var albumUrl = 'http://musique.coeurdepirate.com/album/blonde';
bandcamp.getAlbumInfo(albumUrl, function(error, albumInfo) {
  if (error) {
    console.log(error);
  } else {
    console.log(albumInfo);
  }
});
```

[View example with output](examples/getAlbumInfo.js).


## Test

Feature tests are run _daily_, thank to Travis Ci new feature [CRON Jobs](https://docs.travis-ci.com/user/cron-jobs/). This way we know if the scraper is ever broken.

Run the test:

```bash
npm test
```


## Contributing

Contribution is welcome! Open an issue first.


## License

MIT.
