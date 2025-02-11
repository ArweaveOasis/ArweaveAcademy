import { useState, useEffect } from 'react';
import Link from 'next/link';
import * as bip39 from '@scure/bip39';
import { wordlist as english } from '@scure/bip39/wordlists/english';
import Arweave from 'arweave';

export default function Wallet() {
    const [mnemonic, setMnemonic] = useState('');
    const [privateKey, setPrivateKey] = useState('');
    const [address, setAddress] = useState('');
    const [is24Words, setIs24Words] = useState(false);
    const [clickedButton, setClickedButton] = useState(null);
    const [isClient, setIsClient] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [walletAddress, setWalletAddress] = useState('');
    const [isArConnectAvailable, setIsArConnectAvailable] = useState(false);
    const disconnectWallet = () => {
        setIsConnected(false); 
        setWalletAddress('');   
        setPrivateKey('');       
        setAddress('');          
      };

  useEffect(() => {
    setIsClient(true);
  }, []);

  const generateMnemonic = () => {
    const strength = is24Words ? 256 : 128;
    const mnemonic = bip39.generateMnemonic(english, strength);
    setMnemonic(mnemonic);
    setClickedButton('generateMnemonic');
    setPrivateKey('');
    setAddress('');
  };

  const handleWordSelection = (is24) => {
    setIs24Words(is24);
    setClickedButton(is24 ? 'generate24Word' : 'generate12Word');
  };

  const generatePrivateKey = async (mnemonic) => {
    setClickedButton('generatePrivateKey');
    try {
      const seed = await bip39.mnemonicToSeed(mnemonic, english);
      const arweave = Arweave.init({});
      const jwk = await arweave.wallets.generate();
      setPrivateKey(JSON.stringify(jwk));
      return jwk;
    } catch (error) {
      console.error('Error generating private key:', error);
    }
  };

  const generateArweaveAddress = async () => {
    try {
      const privateKeyData = await generatePrivateKey(mnemonic);
      if (privateKeyData) {
        const arweave = Arweave.init({});
        const address = await arweave.wallets.getAddress(privateKeyData);
        setPrivateKey(JSON.stringify(privateKeyData));
        setAddress(address);
        setClickedButton('generateAddress');
      } else {
        console.error('Private key generation failed.');
      }
    } catch (error) {
      console.error('Error generating address:', error);
    }
  };

  useEffect(() => {
    if (window.arweaveWallet) {
      setIsArConnectAvailable(true);
    }
  }, []);
  
  const connectWithArConnect = async () => {
    try {
      if (!window.arweaveWallet) {
        alert('ArConnect not found. Make sure you have installed the ArConnect extension.');
        return;
      }

      await window.arweaveWallet.connect(['ACCESS_ADDRESS', 'SIGN_TRANSACTION', 'ACCESS_ALL_ADDRESSES']);
      const arweave = Arweave.init({});
      const address = await arweave.wallets.getAddress();
      setWalletAddress(address);
      setIsConnected(true);
    } catch (error) {
      console.error('Failed to connect to ArConnect:', error);
    }
  };
  
  const disconnectArConnect = async () => {
    try {
      await window.arweaveWallet.disconnect();
      setIsConnected(false);
      setWalletAddress('');
    } catch (error) {
      console.error('Failed to disconnect from ArConnect:', error);
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <div>
      <header>
        <h1>Wallet Integration</h1>
      </header>
      <nav>
        <Link href="/">Home</Link> | <Link href="/about">About</Link> | <Link href="/tools">Tools</Link> | <Link href="/wallet">Wallet</Link> | <Link href="/wallet-integration">Wallet Integration Example</Link>
      </nav>
      <main>
        <h2>Connecting to Arweave Wallet</h2>
        <p>
          In this section, we will demonstrate how to connect your Arweave wallet to the application. Arweave uses
          a unique wallet system that allows you to store and manage your AR tokens, which are used to pay for storing
          data on the Arweave network.
        </p>
        <p>
          To interact with Arweave, you can use the <a href="https://www.arweave.org/">Arweave wallet</a> extension or
          integrate your own wallet system with JavaScript APIs that interact with the Arweave blockchain.
        </p>

        <h3>Understanding Mnemonic, Private Key, and Address</h3>
        <p>
          A mnemonic is a series of words that serve as a human-readable representation of a private key. It's a way to encode and backup your private key, which controls access to your wallet and assets. There are typically two lengths of mnemonics: 12 words (128 bits) or 24 words (256 bits). The more words, the more secure the mnemonic is, as it has higher entropy.
        </p>
        
        <h4>Mnemonic (Analogy)</h4>
        <p>
          Think of a mnemonic as a password phrase that is much easier to remember than a random string of characters. For example, it's like a master key that unlocks your wallet. If you forget your private key, the mnemonic is your backup. But, just like a real key, if someone gets their hands on it, they can open your wallet. Keep it safe!
        </p>

        <p>
          <strong>Mnemonic:</strong> A mnemonic is generated using a standard called BIP-39. This mnemonic is a readable version of a private key, and it is used to recover a wallet in case the private key is lost. It should be stored securely, as anyone with the mnemonic can access your wallet.
        </p>
        
        <h4>Private Key (Analogy)</h4>
        <p>
          The private key is like the PIN to your bank account. You should never share it with anyone, and it gives you full control over your funds. If someone gets your private key, they can access everything in your wallet, just like if someone had your PIN. This is the most sensitive part of your wallet.
        </p>

        <p>
          <strong>Private Key:</strong> The private key is a secret key that is generated from the mnemonic. It is used to sign transactions and prove ownership of the wallet. Your private key must be kept safe and never shared. Anyone with your private key can access your wallet and spend your assets.
        </p>

        <h4>Address (Analogy)</h4>
        <p>
          Think of the address as your email address. It's the public part of your wallet. You can freely share it with others to receive tokens or funds. However, unlike a private key, the address is not sensitive and does not give anyone access to your wallet. It's just how others know where to send tokens.
        </p>

        <p>
          <strong>Address:</strong> The address is derived from the private key. It is used to receive transactions or funds. The address is a public identifier and can be shared with others to send you tokens. While the private key should never be shared, the address is public and can be freely distributed.
        </p>

        <p>
          The process for generating these is as follows:
          <ol>
            <li><strong>Generate Mnemonic:</strong> First, a mnemonic is created. This is the first step to generate a wallet. The mnemonic can be 12 or 24 words.</li>
            <li><strong>Generate Private Key:</strong> The mnemonic is then used to generate a private key, which controls access to the wallet.</li>
            <li><strong>Generate Address:</strong> From the private key, an address is generated. This address is used for transactions and can be shared publicly to receive tokens.</li>
          </ol>
        </p>

        <h3>Generate Mnemonic (12 or 24 words)</h3>
        <p>
          A mnemonic is a human-readable way of encoding a private key. You can generate a 12 or 24-word mnemonic that can be
          used to recover a wallet. Below you can choose whether to generate a 12-word or 24-word mnemonic:
        </p>

        <div>
          <button
            onClick={() => handleWordSelection(false)}
            style={{
              backgroundColor: clickedButton === 'generate12Word' ? 'green' : '',
              transition: 'background-color 0.3s ease, transform 0.2s ease',
              transform: clickedButton === 'generate12Word' ? 'scale(1.1)' : 'scale(1)',
            }}
          >
            Generate 12-word Mnemonic
          </button>
          <button
            onClick={() => handleWordSelection(true)}
            style={{
              backgroundColor: clickedButton === 'generate24Word' ? 'green' : '',
              transition: 'background-color 0.3s ease, transform 0.2s ease',
              transform: clickedButton === 'generate24Word' ? 'scale(1.1)' : 'scale(1)',
            }}
          >
            Generate 24-word Mnemonic
          </button>
        </div>

        <button
          onClick={generateMnemonic}
          style={{
            backgroundColor: clickedButton === 'generateMnemonic' ? 'green' : '',
            marginTop: '10px',
            color: 'black',
            padding: '10px',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease, transform 0.2s ease',
            transform: clickedButton === 'generateMnemonic' ? 'scale(1.1)' : 'scale(1)',
          }}
        >
          Generate Mnemonic
        </button>

        {mnemonic && (
          <div>
            <h4>Generated Mnemonic:</h4>
            <textarea
              readOnly
              value={mnemonic}
              style={{ width: '100%', height: '100px', padding: '10px', marginTop: '10px' }}
            />
          </div>
        )}
        <h4>How to Generate a Mnemonic:</h4>
        <p>
          Mnemonic is generated using BIP-39, a standard that represents a private key in a human-readable format. The mnemonic consists of a series of words (12 or 24) that can be used to recover your private key and wallet. These words are randomly selected from a predefined list, ensuring that the mnemonic is both unique and secure. A mnemonic is essential for wallet recovery if the private key is lost.
        </p>
        <p>
          Example of a 12-word mnemonic:
          <code>pencil guitar derive bubble mobile track screen orange major flat frost</code>
        </p>
        <p>
          Example of a 24-word mnemonic:
          <code>pencil guitar derive bubble mobile track screen orange major flat frost lemon rocket robot chef clown puzzle point ribbon desire</code>
        </p>
        <h3>Generate Private Key</h3>
        <button
          onClick={() => generatePrivateKey(mnemonic)}
          style={{
            marginTop: '10px',
            color: 'black',
            padding: '10px',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: clickedButton === 'generatePrivateKey' ? 'green' : '',
            transition: 'background-color 0.3s ease, transform 0.2s ease',
            transform: clickedButton === 'generatePrivateKey' ? 'scale(1.1)' : 'scale(1)',
          }}
        >
          Generate Private Key
        </button>
        <h4>How to Generate a Private Key:</h4>
        <p>
          The private key is derived from the mnemonic. It’s a secret key that allows you to sign transactions and prove ownership of your wallet. The private key must be stored securely and never shared. Anyone who has access to the private key can control the assets within the wallet. The private key is generated using cryptographic algorithms that ensure it is unique and secure.
        </p>
        <p>
  Example of a private key:
  <code>
    {`{
      "kty": "RSA",
      "e": "AQAB",
      "n": "<modulus>",
      "d": "<privateExponent>",
      "p": "<prime1>",
      "q": "<prime2>",
      "dp": "<exponent1>",
      "dq": "<exponent2>",
      "qi": "<coefficient>"
    }`}
  </code>
</p>
        {privateKey && (
          <div>
            <h4>Generated Private Key:</h4>
            <textarea
              readOnly
              value={privateKey}
              style={{ width: '100%', height: '100px', padding: '10px', marginTop: '10px' }}
            />
          </div>
        )}

        <h3>Generate Arweave Address</h3>
        <button
          onClick={generateArweaveAddress}
          style={{
            marginTop: '10px',
            color: 'black',
            padding: '10px',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: clickedButton === 'generateAddress' ? 'green' : '',
            transition: 'background-color 0.3s ease, transform 0.2s ease',
            transform: clickedButton === 'generateAddress' ? 'scale(1.1)' : 'scale(1)',
          }}
        >
          Generate Arweave Address
        </button>

        {address && (
          <div>
            <h4>Generated Arweave Address:</h4>
            <textarea
              readOnly
              value={address}
              style={{ width: '100%', height: '100px', padding: '10px', marginTop: '10px' }}
            />
          </div>
        )}
        <h4>How to Generate an Arweave Address:</h4>
        <p>
          The address is derived from the private key. It serves as your public identifier in the Arweave network, where others can send you tokens or data. This address is public and can be freely shared with others. The address is generated using a process that securely links it to the private key, ensuring that only the wallet's owner can access and manage the assets associated with the address.
        </p>
        <p>
          Example of an Arweave address:
          <code>Qw26ud_xsYxxLnL1tkz-xqzZoLeSvP6XxdgshVe9f_4A</code>
        </p>
        
        <div style={{ marginTop: '20px', color: 'red' }}>
          <h4>WARNING:</h4>
          <p>
            DO NOT use the generated mnemonic or private key here because this is just a demo and example.
            Always ensure you keep your mnemonic and private key secure and private. This is just for educational purposes.
          </p>
        </div>

        <h3>Connect Wallet</h3>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
            <button
                onClick={connectWithArConnect}
                disabled={isConnected || !privateKey}
                style={{
                    marginTop: '10px',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '5px',
                    border: '1px solid transparent',
                    cursor: 'pointer',
                    backgroundColor: isConnected ? '#28a745' : '#007bff',
                    transition: 'all 0.3s ease',
                    transform: isConnected ? 'scale(1.05)' : 'scale(1)',
                    boxShadow: isConnected ? '0 4px 8px rgba(40, 167, 69, 0.2)' : '0 4px 8px rgba(0, 123, 255, 0.2)',
                }}
            >
                {isConnected ? 'Wallet Connected' : 'Connect Wallet'}
            </button>

            {isConnected && (
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <h4 style={{ color: '#28a745' }}>Wallet Connected Successfully!</h4>
                    <p style={{ wordWrap: 'break-word' }}>Address: {walletAddress}</p>
                    <button
                        onClick={disconnectArConnect}
                        style={{
                            marginTop: '10px',
                            color: 'white',
                            padding: '12px 24px',
                            borderRadius: '5px',
                            border: '1px solid transparent',
                            cursor: 'pointer',
                            backgroundColor: '#dc3545',
                            transition: 'all 0.3s ease',
                            transform: 'scale(1)',
                            boxShadow: '0 4px 8px rgba(220, 53, 69, 0.2)',
                        }}
                    >
                Disconnect Wallet
            </button>
        </div>
    )}
</div>
          <p>
            To connect your wallet, click the button below. This will initiate the connection with the Arweave blockchain.
          </p>
        <p>
          In this section, we will demonstrate how to connect your Arweave wallet to the application. Arweave uses
          a unique wallet system that allows you to store and manage your AR tokens, which are used to pay for storing
          data on the Arweave network.
        </p>
        <p>
          To interact with Arweave, you can use the <a href="https://www.arweave.org/">Arweave wallet</a> extension or
          integrate your own wallet system with JavaScript APIs that interact with the Arweave blockchain.
        </p>

      </main>
      <footer>
        <p>&copy; 2025 Frontend Challenge | Powered by Arweave</p>
      </footer>
    </div>
  );
}
