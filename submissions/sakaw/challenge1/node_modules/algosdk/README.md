# js-algorand-sdk

[![Build Status](https://travis-ci.com/algorand/js-algorand-sdk.svg?branch=master)](https://travis-ci.com/algorand/js-algorand-sdk) [![npm version](https://badge.fury.io/js/algosdk.svg)](https://www.npmjs.com/package/algosdk)

AlgoSDK is the official JavaScript library for communicating with the Algorand network. It's designed for modern browsers and Node.js.

## Installation

### [Node.js](https://nodejs.org/en/download/)

```
$ npm install algosdk
```

> This package provides TypeScript types, but you will need [TypeScript](https://www.typescriptlang.org/) version 4.2 or higher to use them properly.

For errors in Webpack 5 or Vite projects, you will need to [install extra dependencies](FAQ.md#it-says-error-cant-resolve-in-the-sdk).

### Browser

Include a minified browser bundle directly in your HTML like so:

```html
<script
  src="https://unpkg.com/algosdk@v1.24.1/dist/browser/algosdk.min.js"
  integrity="sha384-cXCnQHmkjqS84S5jqAp6YXjU1ynCEJaHROHklSY7eh+cCXQ3aGX0oSgJSfQgDF5y"
  crossorigin="anonymous"
></script>
```

or

```html
<script
  src="https://cdn.jsdelivr.net/npm/algosdk@v1.24.1/dist/browser/algosdk.min.js"
  integrity="sha384-cXCnQHmkjqS84S5jqAp6YXjU1ynCEJaHROHklSY7eh+cCXQ3aGX0oSgJSfQgDF5y"
  crossorigin="anonymous"
></script>
```

Information about hosting the package for yourself, finding the browser bundles of previous versions, and computing the SRI hash is [available here](FAQ.md).

## Quick Start

```javascript
const token = 'Your algod API token';
const server = 'http://127.0.0.1';
const port = 8080;
const client = new algosdk.Algodv2(token, server, port);

(async () => {
  console.log(await client.status().do());
})().catch((e) => {
  console.log(e);
});
```

## Documentation

Documentation for this SDK is available here: https://algorand.github.io/js-algorand-sdk/. Additional resources are available on https://developer.algorand.org.

## Examples

Running examples requires access to a running node. Follow the instructions in Algorand's [developer resources](https://developer.algorand.org/docs/run-a-node/setup/install/) to install a node on your computer.

**As portions of the codebase are written in TypeScript, example files cannot be run directly using `node`**. Please refer to the instructions described in the [examples/README.md](examples/README.md) file for more information regarding running the examples.

## SDK Development

### Building

To build a new version of the library, run:

```bash
npm run build
```

### Generating Documentation

To generate the documentation website, run:

```bash
npm run docs
```

The static website will be located in the `docs/` directory.

### Testing

We have two test suites: mocha tests in this repo, and the Algorand SDK test suite from https://github.com/algorand/algorand-sdk-testing.

#### Node.js

To run the mocha tests in Node.js, run:

```bash
npm test
```

To run the SDK test suite in Node.js, run:

```bash
make docker-test
```

#### Browsers

The test suites can also run in browsers. To do so, set the environment variable `TEST_BROWSER` to
one of our supported browsers. Currently we support testing in `chrome` and `firefox`. When
`TEST_BROWSER` is set, the mocha and SDK test suites will run in that browser.

For example, to run mocha tests in Chrome:

```bash
TEST_BROWSER=chrome npm test
```

And to run SDK tests in Firefox:

```bash
TEST_BROWSER=firefox make docker-test
```

### Code Style

This project enforces a modified version of the [Airbnb code style](https://github.com/airbnb/javascript).

We've setup linters and formatters to help catch errors and improve the development experience:

- [Prettier](https://prettier.io/) – ensures that code is formatted in a readable way.
- [ESLint](https://eslint.org/) — checks code for antipatterns as well as formatting.

> If using the Visual Studio Code editor with the [recommended extensions](.vscode/extensions.json), ESLint errors should be highlighted in red and the Prettier extension should format code on every save.

#### Precommit Hook

The linters and formatters listed above should run automatically on each commit to catch errors early and save CI running time.

## License

js-algorand-sdk is licensed under an MIT license. See the [LICENSE](https://github.com/algorand/js-algorand-sdk/blob/master/LICENSE) file for details.
