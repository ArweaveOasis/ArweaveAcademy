# Challenge 1: File-based Routing

This project is a submission to the Frontend Challenge 1: File-based Routing from Arweave Academy. The challenge focuses on building a simple website with multiple HTML files that link to each other and deploying it on Arweave.

This project demonstrates the usage of the [ARx SDK](https://github.com/permaweb/arx) for interacting with the Arweave network. ARx is a powerful SDK/CLI tool that enables permanent data uploads to Arweave.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Prepare your wallet:
   - Export your keyfile from Arweave web wallet extension (it will be named like `arweave-keyfile-xxx.json`)
   - Rename it to `wallet.json` and place it in the root directory of this project
   - Make sure to never commit or share your wallet file as it contains your private key

## Available Scripts

### Check Balance (`check-balance.js`)

This script allows you to check your available upload credits balance on the Arweave network. It uses the ARx SDK to query the balance for your wallet address.

```bash
npm run check-balance
```

### Get Price (`get-price.js`)

This script helps you calculate the price in Winston (Arweave's smallest unit) for uploading a specific amount of data. It's useful for estimating costs before actual uploads.

```bash
npm run get-price
```

### Deploy (`deploy.js`)

This script handles the deployment of your files to the Arweave network. It uses the ARx SDK to upload the contents of your `src` directory permanently to Arweave.

```bash
npm run deploy
```

For more information about the ARx SDK, visit their [GitHub repository](https://github.com/permaweb/arx).
