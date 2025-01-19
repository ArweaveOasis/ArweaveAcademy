# Arweave Upload Challenge

## Description
In this challenge, I successfully uploaded files to Arweave using a script connected to the Arweave network. The uploaded files are **about.md** and **index.md**, located within the `source/_posts` folder.

## Upload Steps
1. Prepare the files to be uploaded, in this case, the files `about.md` and `index.md`.
2. Use the `upload.js` script to upload the files to Arweave.

## Upload Script
The script used to upload files is as follows:

```javascript
const fs = require("fs");
const Arweave = require("arweave");
const wallet = require("./wallet.json");

const arweave = Arweave.init({
  host: "arweave.net",
  port: 443,
  protocol: "https",
});

async function uploadFile(filePath) {
  try {
    console.log("Starting file upload...");
    
    // Read the file to be uploaded
    const fileData = fs.readFileSync(filePath);
    
    // Create a transaction in Arweave
    let transaction = await arweave.createTransaction({ data: fileData }, wallet);
    
    // Sign the transaction
    await arweave.transactions.sign(transaction, wallet);
    
    // Send the transaction
    const response = await arweave.transactions.post(transaction);
    
    if (response.status === 200) {
      console.log("Upload complete! File successfully uploaded to Arweave.");
      console.log(`File available at: https://arweave.net/${transaction.id}`);
    } else {
      console.error("Error uploading file:", response.statusText);
    }
  } catch (error) {
    console.error("An error occurred while uploading the file:", error);
  }
}

// File to be uploaded
const filePath = "./source/_posts/about.md"; // Change this to the path of the file you want to upload
uploadFile(filePath);
