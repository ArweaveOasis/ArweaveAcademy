import Link from 'next/link';

export default function About() {
  return (
    <div>
      <header>
        <h1>About Frontend Challenge 3</h1>
      </header>
      <nav>
        <Link href="/">Home</Link> | <Link href="/about">About</Link> | <Link href="/tools">Tools</Link> | <Link href="/wallet">Wallet</Link> | <Link href="/wallet-integration">Wallet Integration Example</Link>
      </nav>
      <main>
        <h2>What is Arweave?</h2>
        <p>
          Arweave is a revolutionary decentralized storage network that offers permanent data storage through a blockchain-like 
          technology. Data stored on Arweave is immutable, meaning it cannot be altered or deleted, making it a perfect solution for 
          applications that require long-term, reliable, and secure storage. Arweave is built on a decentralized, distributed network, 
          ensuring that data remains accessible and secure without relying on any centralized server.
        </p>
        <p>
          The core concept behind Arweave is "permaweb", a web that permanently stores data in a decentralized manner, ensuring 
          its availability forever. This storage model is designed for long-term use, offering a unique advantage for decentralized 
          applications (dApps) that require guaranteed data permanence.
        </p>

        <h2>Why Use Client-Side Rendering?</h2>
        <p>
          Client-Side Rendering (CSR) is a web application architecture in which the client (browser) handles rendering and 
          updates the user interface, rather than relying on the server for rendering each page. CSR allows for highly interactive 
          applications that respond instantly to user input without the need to reload the entire page. This approach is ideal for 
          dynamic applications that require real-time data and seamless transitions between views.
        </p>
        <p>
          By using CSR for this application, we ensure that users have an enhanced experience with real-time updates and interactive 
          elements. Additionally, CSR helps minimize the load on the server, as all the heavy lifting is done in the client’s browser, 
          making the app faster and more efficient.
        </p>

        <h2>Why Build on Arweave?</h2>
        <p>
          Building on Arweave provides unique benefits that are aligned with the principles of decentralization and data permanence. 
          Arweave's permanent storage ensures that once data is uploaded to the network, it will remain there forever without the risk of 
          being deleted or altered. This feature is crucial for applications that rely on the integrity and availability of their data.
        </p>
        <p>
          In this challenge, the goal is to build a web application that integrates with Arweave’s permanent storage network, 
          demonstrating how a decentralized application can be powered entirely by data stored on the Arweave blockchain.
        </p>
        <h2>Technological Benefits of CSR with Arweave</h2>
        <p>
          Combining CSR with Arweave's permanent storage ensures that the application remains efficient and scalable while benefiting 
          from Arweave’s robust decentralized architecture. Data stored on Arweave can be easily retrieved by the client without the 
          need for server-side infrastructure. This makes the application highly reliable, cost-effective, and easily scalable.
        </p>
      </main>
      <footer>
        <p>&copy; 2025 Frontend Challenge | Powered by Arweave</p>
      </footer>
    </div>
  );
}
