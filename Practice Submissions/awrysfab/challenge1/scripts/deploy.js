const ARx = require('@permaweb/arx');
const fs = require('fs');

async function cleanManifests() {
  const manifestFiles = ['src-id.txt', 'src-manifest.csv', 'src-manifest.json'];
  manifestFiles.forEach(file => {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
      console.log(`Cleaned up ${file}`);
    }
  });
}

async function deployWebsite() {
  try {
    // Clean up old manifest files
    await cleanManifests();

    // Load wallet from JSON file
    const wallet = JSON.parse(fs.readFileSync('wallet.json', 'utf-8'));

    // Initialize ARx with your wallet
    const arx = new ARx({
      url: 'https://turbo.ardrive.io',
      token: 'arweave',
      key: wallet
    });

    // Check balance first
    const balance = await arx.getBalance();
    console.log('Current balance:', balance);

    // Get price estimate
    const price = await arx.getPrice(1024 * 1024); // Estimate for 1MB
    console.log('Estimated price:', price);

    // Upload the website directory
    const result = await arx.uploadFolder('./src', {
      indexFile: 'index.html'
    });

    console.log('\n✅ Website deployed successfully!');
    console.log('Transaction ID:', result.id);
    console.log('Access your website at:', `https://arweave.net/${result.id}`);

  } catch (error) {
    console.error('❌ Error deploying website:', error);
  }
}

deployWebsite();