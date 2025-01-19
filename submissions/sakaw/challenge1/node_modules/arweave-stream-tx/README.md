# arweave-stream-tx

[![npm](https://img.shields.io/npm/v/arweave-stream-tx)](https://www.npmjs.com/package/arweave-stream-tx)
[![tests](https://github.com/CDDelta/arweave-stream-tx/workflows/tests/badge.svg)](https://github.com/CDDelta/arweave-stream-tx/actions?query=workflow%3Atests)

Since the release of the v2 transaction format, Arweave theoretically supports data transactions of infinite size. However, common interfaces for creating Arweave transactions such as `arweave-js` are limited in the size of transactions they can create due to their implementation requiring all transaction data be eagerly loaded into memory. This bounds them to their runtime memory limitations (eg. approx. ~2GB for Node) and prevents complete utility of Arweave's capabilities.

This package introduces async versions of methods provided in `arweave-js` to allow the creation and upload of Arweave transactions of theoretically infinite size.

This package only works with Node 15+ and does not currently include browser support as browsers and NodeJS do not share a common streams API.

## Usage

```typescript
import Arweave from 'arweave';
import { createTransactionAsync, uploadTransactionAsync } from 'arweave-stream-tx';
import { createReadStream } from 'fs';
import { pipeline } from 'stream/promises';

const arweave = new Arweave({
  host: 'arweave.net',
  protocol: 'https',
  port: 443,
  logging: false,
  timeout: 15000,
});

const filePath = '<file path>';
const wallet = await arweave.wallets.generate();

// Create the transaction.
const tx = await pipeline(createReadStream(filePath), createTransactionAsync({}, arweave, wallet));
await arweave.transactions.sign(tx, wallet);

// Upload it to Arweave.
await pipeline(createReadStream(filePath), uploadTransactionAsync(tx, arweave));
```

## Development

To build the package, run:

```bash
npm run build
```

To deploy the package, run:

```bash
npm publish
```

To execute the tests, run:

```bash
npm test
```
