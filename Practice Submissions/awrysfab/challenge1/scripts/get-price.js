const ARx = require('@permaweb/arx');
const fs = require('fs');
const path = require('path');

async function calculateFolderSize(folderPath) {
  let totalSize = 0;

  function getAllFiles(dirPath) {
    const files = fs.readdirSync(dirPath);

    files.forEach((file) => {
      const filePath = path.join(dirPath, file);
      if (fs.statSync(filePath).isDirectory()) {
        getAllFiles(filePath);
      } else {
        const stats = fs.statSync(filePath);
        totalSize += stats.size;
      }
    });
  }

  getAllFiles(folderPath);
  return totalSize;
}

async function getPrice() {
  try {
    // Load wallet
    const walletPath = path.join(__dirname, '..', 'wallet.json');
    const wallet = JSON.parse(fs.readFileSync(walletPath, 'utf-8'));

    // Initialize ARx
    const arx = new ARx({
      url: 'https://turbo.ardrive.io',
      token: 'arweave',
      key: wallet
    });

    // Calculate total size of src folder
    const folderSize = await calculateFolderSize('./src');
    console.log(`Total folder size: ${(folderSize / 1024).toFixed(2)} KB`);

    // Get price estimate
    const price = await arx.getPrice(folderSize);

    // Convert winston to AR (1 AR = 1000000000000 winston)
    const priceInAR = price / 1000000000000;

    console.log('Estimated price:');
    console.log(`${price} winston`);
    console.log(`${priceInAR.toFixed(8)} AR`);

    // Get current balance
    const balance = await arx.getBalance();
    const balanceInAR = balance / 1000000000000;

    console.log('\nCurrent balance:');
    console.log(`${balance} winston`);
    console.log(`${balanceInAR.toFixed(8)} AR`);

    // Check if balance is sufficient
    if (balance >= price) {
      console.log('\n✅ You have sufficient balance to deploy');
    } else {
      console.log('\n❌ Insufficient balance for deployment');
      console.log(`You need ${(price - balance) / 1000000000000} more AR`);
    }

  } catch (error) {
    console.error('Error getting price:', error);
  }
}

getPrice();