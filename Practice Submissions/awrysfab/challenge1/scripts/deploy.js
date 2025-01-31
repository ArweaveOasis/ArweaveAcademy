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
    await cleanManifests();

    const wallet = JSON.parse(fs.readFileSync('wallet.json', 'utf-8'));

    const arx = new ARx({
      url: 'https://turbo.ardrive.io',
      token: 'arweave',
      key: wallet
    });

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