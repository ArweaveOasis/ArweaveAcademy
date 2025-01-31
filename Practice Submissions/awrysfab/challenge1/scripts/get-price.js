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
    const walletPath = path.join(__dirname, '..', 'wallet.json');
    const wallet = JSON.parse(fs.readFileSync(walletPath, 'utf-8'));

    const arx = new ARx({
      url: 'https://turbo.ardrive.io',
      token: 'arweave',
      key: wallet
    });

    const folderSizeBytes = await calculateFolderSize('./src');
    const folderSizeKB = folderSizeBytes * 1024; // Convert bytes to kilobytes
    console.log(`Total folder size: ${(folderSizeBytes / 1024).toFixed(2)} KB`);

    const price = await arx.getPrice(folderSizeKB);

    const priceInAR = price.dividedBy(1e12).toFixed(6);

    console.log('Estimated price:');
    console.log(`${price} winston`);
    console.log(`${priceInAR} AR`);

    const balance = await arx.getBalance(arx.tokenConfig._address);
    const balanceInAR = balance.dividedBy(1e12).toFixed(6);

    console.log('\nCurrent balance:');
    console.log(`${balance} winston`);
    console.log(`${balanceInAR} AR`);

    if (balance >= price) {
      console.log('\n✅ You have sufficient balance to deploy');
    } else {
      console.log('\n❌ Insufficient balance for deployment');
      console.log(`You need ${(price - balance).dividedBy(1e12).toFixed(6)} more AR`);
    }

  } catch (error) {
    console.error('Error getting price:', error);
  }
}

getPrice();