# MyAlgo Connect

[![npm version](https://badge.fury.io/js/@randlabs%2Fmyalgo-connect.svg)](https://badge.fury.io/js/@randlabs%2Fmyalgo-connect)
[![Website shields.io](https://img.shields.io/website-up-down-green-red/http/shields.io.svg)](https://connect.myalgo.com/)
[![Discord](https://badgen.net/badge/icon/discord?icon=discord&label)](https://discord.com/channels/491256308461207573/817420411502329896)
[![Twitter](https://badgen.net/badge/icon/twitter?icon=twitter&label)](https://twitter.com/myalgo_)

![myalgo-logo](brand-kit/my-algo.png)

* [Overview](#Overview)
* [Installation](#Installation)
* [API Usage](#API-Usage)
  * [Quick start](#Quick-start)
  * [Connect to My Algo](#Connect-to-My-Algo)
  * [Sign transaction](#Sign-transaction)
* [Documentation](#Documentation)
* [Copyright and License](#Copyright-and-License)

## Overview

MyAlgo Connect is a Javascript library developed by Rand Labs to securely sign transactions with [My Algo](https://wallet.myalgo.com)

## Installation  

The package can be installed via npm:

```sh
npm i @randlabs/myalgo-connect
```

or imported in the HTML

```html
<script src="./myalgo.min.js"></script>
```

Find the browser minified version in our github [releases](https://github.com/randlabs/myalgo-connect/releases)

## API Usage  

### Quick start

```js
import MyAlgoConnect from '@randlabs/myalgo-connect';
const myAlgoWallet = new MyAlgoConnect();
```

### Connect to My Algo  

```js
/*Warning: Browser will block pop-up if user doesn't trigger myAlgoWallet.connect() with a button interation */
async function connectToMyAlgo() {
  try {
    const accounts = await myAlgoWallet.connect();
    const addresses = accounts.map(account => account.address);
    
  } catch (err) {
    console.error(err);
  }
}
```

```html
<button onclick="connectToMyAlgo()">Connect!</button>
```

### Sign transaction

```js
import algosdk from 'algosdk';
const algodClient = new algosdk.Algodv2('', 'https://node.algoexplorerapi.io/', 443);

/*Warning: Browser will block pop-up if user doesn't trigger myAlgoWallet.connect() with a button interation */
async function signTransaction (from, to, amount, suggestedParams) {
  try {
    const txn = algosdk.makePaymentTxnWithSuggestedParams({ suggestedParams, from, to, amount });
    const signedTxn = await myAlgoWallet.signTransaction(txn.toByte());  
    const response = await algodClient.sendRawTransaction(signedTxn.blob).do();
    console.log(response)
  } catch(err) {
    console.error(err); 
  }
};
```

## Documentation

Documentation for this package is available here: <https://connect.myalgo.com/>. An example of an integration with MyAlgo Connect: <https://github.com/randlabs/myalgo-connect-test>

## Copyright and License  

See [LICENSE](LICENSE.md) file.
