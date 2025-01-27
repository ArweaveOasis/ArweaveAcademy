import { useState } from 'react';
import Arweave from 'arweave';
import * as bip39 from 'bip39';
import { FaTwitter, FaTelegram, FaYoutube, FaGithub, FaWallet } from 'react-icons/fa';

const WalletGenerator = () => {
  const [wallet, setWallet] = useState<{ address: string; phrase: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const generateWallet = async () => {
    try {
      const arweave = Arweave.init({
        host: 'arweave.net',
        port: 443,
        protocol: 'https',
      });

      const mnemonic = bip39.generateMnemonic();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const seed = bip39.mnemonicToSeedSync(mnemonic).toString('hex'); // Suppressed unused warning
      const key = await arweave.wallets.generate();
      const address = await arweave.wallets.jwkToAddress(key);

      setWallet({
        address,
        phrase: mnemonic,
      });
      setCopied(false);
    } catch (error) {
      console.error('Error generating wallet:', error);
      alert('Failed to generate wallet. Please try again.');
    }
  };

  const copyToClipboard = () => {
    if (wallet) {
      navigator.clipboard.writeText(wallet.phrase);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-6 rounded-lg shadow-lg max-w-lg mx-auto text-center mb-12">
      <div className="mt-6 text-left relative">
        <a 
          href="https://www.arconnect.io/download" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ 
            position: 'absolute', 
            right: '10px', 
            top: '0px', 
            color: 'white', 
            fontWeight: 'bold', 
            textDecoration: 'none', 
            display: 'flex', 
            alignItems: 'center',
            gap: '6px'
          }}
          className="hover:underline"
        >
          <FaWallet className="text-xl" /> Install Wallet
        </a>

        <div className="mt-10">
          <p className="font-semibold text-white mb-2">Address:</p>
          <input 
            className="w-full border p-2 rounded-md bg-black bg-opacity-50 text-white placeholder-gray-300"
            readOnly
            value={wallet ? wallet.address : ''}
            placeholder="Your Wallet"
          />
        </div>

        <div className="mt-6">
          <p className="font-semibold text-white mb-2">Seed Phrase:</p>
          <textarea 
            className="w-full h-32 border p-2 rounded-md bg-black bg-opacity-50 text-white placeholder-gray-300"
            readOnly
            value={wallet ? wallet.phrase : ''}
            placeholder="Your Seed Phrase"
          />
        </div>

        <div className="flex flex-wrap gap-4 justify-center mt-6">
          <button 
            onClick={generateWallet} 
            className="px-6 py-3 border border-white bg-black bg-opacity-50 text-white rounded-md hover:bg-opacity-70 transition-all duration-500 transform active:scale-90"
          >
            Generate Wallet
          </button>

          <button 
            onClick={copyToClipboard} 
            className="px-6 py-3 border border-white bg-black bg-opacity-50 text-white rounded-md hover:bg-opacity-70 transition-all duration-500 transform active:scale-90"
            disabled={!wallet}
          >
            {copied ? 'Copied!' : 'Copy Seed Phrase'}
          </button>
        </div>
      </div>

      <div className="mt-12 flex justify-center gap-6">
        <a href="https://twitter.com/bangpateng_" target="_blank" rel="noopener noreferrer" className="text-white text-3xl hover:text-gray-400">
          <FaTwitter />
        </a>
        <a href="https://t.me/bangpateng_airdrop" target="_blank" rel="noopener noreferrer" className="text-white text-3xl hover:text-gray-400">
          <FaTelegram />
        </a>
        <a href="https://youtube.com/c/bangpateng" target="_blank" rel="noopener noreferrer" className="text-white text-3xl hover:text-gray-400">
          <FaYoutube />
        </a>
        <a href="https://github.com/bangpateng" target="_blank" rel="noopener noreferrer" className="text-white text-3xl hover:text-gray-400">
          <FaGithub />
        </a>
      </div>
    </div>
  );
};

export default WalletGenerator;
