# NEAR Seed Phrase

This tool enables creating and converting mnemonic-phrases, public key and private key for NEAR accounts.

### Install
```js
npm i near-seed-phrase
```

### Usage
```js
const { parseSeedPhrase, generateSeedPhrase } = require('near-seed-phrase');

// to create a seed phrase with its corresponding Keys
const {seedPhrase, publicKey, secretKey} = generateSeedPhrase()

// To recover keys from the seed phrase
const { publicKey, secretKey } = parseSeedPhrase(seedPhrase);
```
