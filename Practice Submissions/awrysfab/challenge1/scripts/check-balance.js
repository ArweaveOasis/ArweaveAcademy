const ARx = require('@permaweb/arx');
const fs = require('fs');
const path = require('path');

async function checkBalance() {
  try {
    const walletPath = path.join(__dirname, '..', 'wallet.json');
    const wallet = JSON.parse(fs.readFileSync(walletPath, 'utf-8'));
    
    const arx = new ARx({
      url: 'https://turbo.ardrive.io',
      token: 'arweave',
      key: wallet
    });

    const balance = await arx.getBalance(arx.tokenConfig._address);
    const balanceInAR = balance.dividedBy(1e12).toFixed(6); // Convert Winston to AR
    console.log('Current balance:', balanceInAR, 'AR');
  } catch (error) {
    console.error('Error checking balance:', error);
  }
}

checkBalance();