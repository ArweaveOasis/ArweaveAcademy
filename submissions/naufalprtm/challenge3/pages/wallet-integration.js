import Link from 'next/link';

export default function WalletIntegration() {
  return (
    <div>
      <header>
        <h1>Wallet Integration Example</h1>
      </header>
      <nav>
        <Link href="/">Home</Link> | <Link href="/about">About</Link> | <Link href="/tools">Tools</Link> | <Link href="/wallet">Wallet</Link> | <Link href="/wallet-integration">Wallet Integration Example</Link>
      </nav>
      <main>
        <h3>Extended Example of Wallet Integration with Additional Features:</h3>
        <pre>
          <code>
            {`import Arweave from 'arweave';

// Initialize Arweave client
const arweave = Arweave.init({/* config */});

// Create a new wallet
const wallet = await arweave.wallets.generate();

// Get wallet balance
const balance = await arweave.wallets.getBalance(wallet);

// Convert balance from winstons to AR
const formattedBalance = arweave.ar.winstonToAr(balance);
console.log('Wallet Balance in AR:', formattedBalance);

// Create a transaction and sign it with the wallet
const transaction = await arweave.createTransaction({ data: 'Hello, Arweave!' }, wallet);

// Sign the transaction
await arweave.transactions.sign(transaction, wallet);

// Send the transaction to the Arweave network
const response = await arweave.transactions.post(transaction);
console.log('Transaction ID:', transaction.id);
console.log('Transaction status:', response.status);
`}
          </code>
        </pre>

        <p>
          In this extended example, we not only generate a wallet and check its balance, but we also:
        </p>

        <ul>
          <li><strong>Create and Sign Transactions:</strong> We create a simple transaction to store some data on Arweave, sign it using the wallet's private key, and send it to the network.</li>
          <li><strong>Track Transaction Status:</strong> After sending the transaction, we track the status to confirm whether it was successfully posted to the blockchain.</li>
        </ul>

        <p>
          ### Detailed Breakdown:
        </p>
        <ul>
          <li>
            <strong>Create Transaction:</strong> The <code>arweave.createTransaction()</code> method is used to create a new transaction. This transaction will contain data (in this case, a simple string) that will be stored on the Arweave network. You can store larger files or JSON objects as well.
          </li>
          <li>
            <strong>Sign Transaction:</strong> After creating the transaction, we use the <code>arweave.transactions.sign()</code> method to sign it with the wallet's private key. Signing the transaction is essential to prove ownership and authorization to perform the action.
          </li>
          <li>
            <strong>Send Transaction:</strong> The <code>arweave.transactions.post()</code> method is used to send the signed transaction to the Arweave network. This is the step where the data is stored permanently and immutably on the blockchain.
          </li>
          <li>
            <strong>Track Transaction Status:</strong> After posting the transaction, the <code>response.status</code> will indicate whether the transaction was successfully processed.
          </li>
        </ul>

        <p>
          ### Additional Features and Use Cases:
        </p>
        <ul>
          <li><strong>Secure File Storage:</strong> Store large files such as images, videos, or documents directly on Arweave. Arweave ensures the data remains accessible and immutable for the long term.</li>
          <li><strong>Data Retrieval:</strong> Use the transaction ID to retrieve the stored data at any time in the future, which will be available for anyone to access and verify.</li>
          <li><strong>Interacting with Smart Contracts:</strong> Arweave can be used to interact with decentralized applications (dApps) and smart contracts, allowing for a wide range of decentralized services beyond data storage.</li>
        </ul>

        <p>
          ### Example: Upload a JSON Object as Data:
        </p>
        <pre>
          <code>
            {`// Example to upload a JSON object as data
const jsonData = { name: 'John Doe', age: 30, city: 'New York' };

// Create a transaction with JSON data
const transaction = await arweave.createTransaction({ data: JSON.stringify(jsonData) }, wallet);

// Sign and send the transaction
await arweave.transactions.sign(transaction, wallet);
const response = await arweave.transactions.post(transaction);

// Get the transaction ID and status
console.log('Transaction ID:', transaction.id);
console.log('Transaction status:', response.status);
`}
          </code>
        </pre>

        <p>
          In this example, we're uploading a JSON object containing user data. The process is similar to uploading a simple text string, but this time we serialize the object using <code>JSON.stringify()</code> before sending it.
        </p>

        <p>
          ### Handling Error Responses:
        </p>
        <ul>
          <li>
            <strong>Transaction Errors:</strong> Sometimes, you may encounter errors when creating or posting transactions. It’s important to handle these errors gracefully to ensure that your application can recover and display relevant messages to users.
          </li>
        </ul>

        <pre>
          <code>
            {`try {
              const response = await arweave.transactions.post(transaction);
              if (response.status !== 200) {
                throw new Error('Transaction failed');
              }
              console.log('Transaction successful!');
            } catch (error) {
              console.error('Error posting transaction:', error.message);
            }`}
          </code>
        </pre>

        <p>
          In this example, we use a <code>try...catch</code> block to handle any errors that may occur during the transaction posting process. If the response status is not successful (i.e., not 200), we throw an error and log it to the console.
        </p>

        <p>
          ### Best Practices for Wallet Integration:
        </p>
        <ul>
          <li><strong>Private Key Security:</strong> Always ensure that the private key is stored securely. You should never expose the private key on the client-side, and use secure methods for encryption and decryption if storing it locally.</li>
          <li><strong>Transaction Fees:</strong> Keep in mind that sending transactions requires AR tokens. Users should have a sufficient balance before initiating transactions. You can inform users about fees and ensure they have enough AR in their wallet.</li>
          <li><strong>Transaction Confirmation:</strong> It's always a good idea to confirm transactions through the Arweave network, especially for large or important transactions, to ensure they are successfully mined and stored.</li>
        </ul>

        <p>
          ### Next Steps:
        </p>
        <ul>
          <li>Learn about transaction fees and how to manage them in your application to ensure users can always send transactions.</li>
          <li>Explore how to use Arweave for decentralized file storage in your application.</li>
          <li>Enhance wallet functionality by adding support for importing existing wallets, managing multiple wallets, or integrating with other blockchain networks.</li>
        </ul>
      </main>
      <footer>
        <p>&copy; 2025 Frontend Challenge | Powered by Arweave</p>
      </footer>
    </div>
  );
}
