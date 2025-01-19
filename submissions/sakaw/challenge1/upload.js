// Importing the Bundlr client to interact with the Arweave network
const Bundlr = require('@bundlr-network/client').default;
const fs = require('fs');

// Set up your wallet using the wallet.json file
const wallet = JSON.parse(fs.readFileSync('wallet.json', 'utf-8'));

// Initialize the Bundlr client with Arweave's gateway and wallet
const bundlr = new Bundlr('https://node1.bundlr.network', 'arweave', wallet);

// Function to upload a file to Arweave via Bundlr
async function uploadFile() {
  try {
    // Path to the file you want to upload
    const filePath = './index.html'; // Replace with your file path

    // Read the file data
    const fileData = fs.readFileSync(filePath);

    // Create a transaction to upload the file
    const transaction = bundlr.createTransaction(fileData, { tag: 'html' });

    // Sign and send the transaction to the Arweave network
    await transaction.sign();
    const result = await transaction.send();

    // Log the result with the Transaction ID
    console.log(`File uploaded successfully! Transaction ID: ${result.id}`);
  } catch (error) {
    // Handle any errors that occur during the upload
    console.error('Error uploading file:', error);
  }
}

// Run the uploadFile function
uploadFile();
