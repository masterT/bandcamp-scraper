[![Bandcamp Logo](https://github.com/masterT/bandcamp-scraper/blob/master/assets/bandcamp.png?raw=true)](https://bandcamp.com)

# bandcamp-scraper

[![npm version](https://badge.fury.io/js/bandcamp-scraper.svg)](https://badge.fury.io/js/bandcamp-scraper)

TypeScript and JavaScript client for Bandcamp using scraping and private API.

⚠️ This package won't work in the browser since [bandcamp.com](https://bandcamp.com/) blocks [Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) requests.

Documentations
- [Typescript documentation](https://masterT.github.io/bandcamp-scraper/typescript/)

---

## Table of Contents

* [Requirements](#requirements)
* [Installation](#installation)
* [Usage](#usage)
* [Documentation](#documentation)
* [Development](#development)
* [License](#license)

## Requirements

- Node.js

## Installation

Using _npm_:

```shell
npm install -s bandcamp-scraper
```

Using _yarn_:

```shell
yarn add bandcamp-scraper
```

With ES6 modules:

```js
import BandcampScraper from require('bandcamp-scraper');
```

With CommonJS modules:

```js
const BandcampScraper = require('bandcamp-scraper');
```

## Usage

...

## Documentation

- [Typescript documentation](https://masterT.github.io/bandcamp-scraper/typescript/)

...

## Development

Requirements:
- Yarn

### Documentation

Generate documentation using [TypeDoc](https://typedoc.org/):

```shell
yarn documentation
```

### Lint

Executing lint check using [ESLint](https://eslint.org/):

```shell
yarn lint
```

Executing lint fix using [ESLint](https://eslint.org/):

```shell
yarn format
```

### Test

Executing [Jest](https://jestjs.io/) tests for unit and integration test suites:

```shell
yarn test
```

Executing [Jest](https://jestjs.io/) tests for unit ([jest.unit.config.js](./jest.unit.config.js)) test suites:

```shell
yarn test:unit
```

Executing [Jest](https://jestjs.io/) tests for integration ([jest.integration.config.js](./jest.integration.config.js)) test suites:

```shell
yarn test:integration
```

## License

[MIT](./LICENSE)
