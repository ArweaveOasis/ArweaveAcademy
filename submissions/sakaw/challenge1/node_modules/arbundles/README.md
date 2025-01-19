# ANS-104 Bundles

**If you want to use Bundlr Network head over to [this repo](https://github.com/Bundlr-Network/js-client)**

A low level library for creating, editing, reading and verifying bundles.

See [ANS-104](https://github.com/ArweaveTeam/arweave-standards/blob/master/ans/ANS-104.md) for more details.

## Installing the library

Using npm:

`npm install arbundles`

Using yarn:

`yarn add arbundles`

## Creating bundles

```ts
import { bundleAndSignData, createData } from "arbundles";

const dataItems = [createData("some data"), createData("some other data")];

const signer = new ArweaveSigner(jwk);

const bundle = await bundleAndSignData(dataItems, signer);
```
