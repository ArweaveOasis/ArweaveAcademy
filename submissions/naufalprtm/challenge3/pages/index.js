import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  return (
    <div>
      <header>
        <h1>Frontend Challenge 3</h1>
        <p>Client-Side Rendering with Next.js</p>
      </header>
      <nav>
        <Link href="/">Home</Link> | <Link href="/about">About</Link> | <Link href="/tools">Tools</Link> | <Link href="/wallet">Wallet</Link> | <Link href="/wallet-integration">Wallet Integration Example</Link>
      </nav>
      <main>
        <img src="/image/school-of-dumdum.jpg" alt="School of Dumdum" style={{ width: '100%', height: 'auto' }} />
        <section>
          <h2>Welcome to the Arweave Client-Side Rendering Challenge</h2>
          <p>
            This challenge will guide you through building an interactive web app that renders on the client-side, 
            using Arweave as its storage backend. The application uses <strong>Client-Side Rendering (CSR)</strong>, 
            ideal for apps that require dynamic interaction and frequent content updates. It is powered by 
            <strong>Arweave</strong>, a permanent storage platform that stores data in a decentralized, immutable manner.
          </p>
          <p>
            Client-Side Rendering (CSR) offers several advantages:
            <ul>
              <li><strong>Faster load times:</strong> The page loads quickly because the server does not render the HTML.</li>
              <li><strong>Interactive:</strong> CSR allows real-time updates and interactivity without server involvement.</li>
              <li><strong>Efficient for dynamic apps:</strong> Best suited for applications that change frequently based on user input.</li>
            </ul>
          </p>
          <p>
            Here is a simple example to demonstrate how CSR works in Next.js:
          </p>
          
          {/* Example: Counter using useState */}
          <pre>
            <code>
{`import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => setCount(count + 1);

  return (
    <div>
      <h2>Counter: {count}</h2>
      <button onClick={increment}>Increment</button>
    </div>
  );
}`}</code>
          </pre>
          
          <p>
            This simple counter app allows users to click the "Increment" button to increase the value. Every time the button is pressed, 
            the state variable `count` is updated using the `setCount` function, demonstrating how React handles dynamic changes client-side.
          </p>
          
          <h3>Detailed Explanation of the Code:</h3>
          <ul>
            <li><strong>useState Hook:</strong> The <code>useState</code> hook is used to manage state in functional components. In this case, it initializes the <code>count</code> state variable with a starting value of 0.</li>
            <li><strong>Increment Function:</strong> This function updates the <code>count</code> variable by adding 1 every time it is called, which happens when the button is clicked.</li>
            <li><strong>Button Element:</strong> The <code>button</code> has an <code>onClick</code> event handler that calls the <code>increment</code> function each time the user clicks it.</li>
          </ul>
          
          <p>
            This code is executed entirely on the client, meaning no server is required to handle state changes or re-render the page. Instead, React efficiently updates the DOM on the client-side.
          </p>
          
          <h3>What is Client-Side Rendering (CSR)?</h3>
          <p>
            Client-Side Rendering (CSR) refers to the technique where the client (browser) is responsible for rendering content, rather than the server. With CSR, the server sends a minimal HTML file and a bundle of JavaScript to the browser. The JavaScript then takes over and renders the content dynamically on the client side.
          </p>
          <p>
            CSR is well-suited for apps that need frequent updates, like real-time data dashboards or interactive UIs. Since the rendering happens in the browser, CSR eliminates the need for full-page reloads or server-side involvement after the initial request.
          </p>
          <p>
            As mentioned, Arweave's permanent storage makes it a great fit for applications that require long-term, decentralized data storage. Arweave offers users the ability to store their data permanently on the blockchain in a cost-effective and decentralized way, ensuring that information remains accessible for the long term.
          </p>

          <h3>How Arweave Enhances CSR Applications:</h3>
          <p>
            Using Arweave with CSR enables the combination of dynamic user interactions with permanent, decentralized storage. Here's how Arweave improves your app:
          </p>
          <ul>
            <li><strong>Permanent Data Storage:</strong> Arweave ensures that data, such as user interactions or uploaded files, is permanently stored. No more worrying about losing data once your app is deployed.</li>
            <li><strong>Decentralization:</strong> Unlike traditional cloud storage, Arweave uses a decentralized network to store data, ensuring resilience against censorship or server failures.</li>
            <li><strong>Efficient Storage for Dynamic Apps:</strong> Arweave supports applications that handle dynamic content by storing data at a low cost while keeping it accessible in the long term.</li>
            <li><strong>Interoperability with Web3:</strong> Since Arweave is a decentralized storage platform, it integrates seamlessly with blockchain technologies and Web3 applications, offering exciting possibilities for decentralized applications (dApps).</li>
          </ul>

          <h3>Setting up Arweave in Your Next.js App:</h3>
          <p>
            To use Arweave in your app, you can start by installing the Arweave JavaScript SDK. Here's an example of how to use it to interact with Arweave's decentralized storage:
          </p>

          <pre>
            <code>
{`import Arweave from 'arweave';

const arweave = Arweave.init({
  host: 'arweave.net', // The Arweave network's host URL
  port: 443,
  protocol: 'https'
});

const storeDataOnArweave = async (data) => {
  const transaction = await arweave.createTransaction({ data });
  await arweave.transactions.sign(transaction);
  await arweave.transactions.post(transaction);
  console.log('Data stored on Arweave with transaction ID:', transaction.id);
};
`}</code>
          </pre>
          
          <p>
            This code snippet initializes an Arweave client and demonstrates how to store data on Arweave. You can integrate this logic to store dynamic data generated by your app's client-side rendering.
          </p>

          <h3>Advantages of CSR in Arweave-based Applications:</h3>
          <ul>
            <li><strong>Fast Updates:</strong> Updates and state changes happen instantly without the need for server-side re-renders.</li>
            <li><strong>Reduced Server Load:</strong> CSR offloads the rendering process to the client, reducing strain on the server.</li>
            <li><strong>Permanent Data Storage:</strong> Arweave can be used as a backend to store and serve data permanently, even after the app is no longer hosted.</li>
          </ul>

        </section>
      </main>
      <footer>
        <p>&copy; 2025 Frontend Challenge | Powered by Arweave</p>
      </footer>
    </div>
  );
}
