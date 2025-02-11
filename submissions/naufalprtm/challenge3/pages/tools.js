import Link from 'next/link';

export default function Tools() {
  return (
    <div>
      <header>
        <h1>Tools for Building the Application</h1>
      </header>
      <nav>
        <Link href="/">Home</Link> | <Link href="/about">About</Link> | <Link href="/tools">Tools</Link> | <Link href="/wallet">Wallet</Link> | <Link href="/wallet-integration">Wallet Integration Example</Link>
      </nav>
      <main>
        <h2>Key Tools for Building this App</h2>
        <p>
          This section explains the essential tools used to build the application and how each tool contributes to 
          the development process.
        </p>

        <h3>1. <strong>Next.js</strong></h3>
        <p>
          Next.js is a React framework that enables the development of server-rendered and statically generated web applications. 
          It offers automatic code splitting, optimized performance, and improved SEO capabilities by rendering the initial HTML on 
          the server and sending it to the browser. This makes Next.js ideal for building modern web applications that require fast load times 
          and a seamless user experience. Although we are focusing on Client-Side Rendering (CSR), Next.js can also support Server-Side Rendering (SSR) 
          for hybrid applications.
        </p>
        <p>
          With Next.js, you can leverage both CSR and SSR in the same app, allowing for flexibility based on the type of interaction required. 
          For our app, CSR is used to make it interactive, while still benefiting from Next.js’s routing and optimization features.
        </p>

        <h3>2. <strong>Arx</strong></h3>
        <p>
          Arx is a tool that provides a simple interface to interact with the Arweave blockchain. It allows for seamless data storage 
          and retrieval from Arweave, which is crucial for building decentralized apps that need permanent storage solutions. 
          Arx simplifies the process of interacting with Arweave, helping developers easily integrate Arweave's storage solutions into their web apps.
        </p>
        <p>
          With Arx, developers can store and retrieve files, metadata, and other necessary data, ensuring that once information is 
          uploaded to Arweave, it remains accessible forever. This aligns perfectly with our app's goal of permanent data storage, 
          as all essential data is securely stored on Arweave’s decentralized network.
        </p>

        <h3>3. <strong>React</strong></h3>
        <p>
          React is a widely-used JavaScript library for building user interfaces. It allows for the development of reusable UI components 
          and efficient state management. React provides a declarative approach to creating interactive web applications, enabling developers 
          to manage complex UIs with ease.
        </p>
        <p>
          React's component-based architecture is ideal for building modern web applications where the user interface is dynamic and 
          responsive to user input. In this challenge, React powers the frontend of the application, allowing for smooth interactions and 
          enabling dynamic updates to the UI.
        </p>

        <h3>4. <strong>Arweave’s API</strong></h3>
        <p>
          Arweave's API provides the necessary tools for interacting with the decentralized storage platform. By using Arweave's API, 
          developers can securely upload and retrieve data from the Arweave network. This API is an essential part of our app, ensuring 
          that data is stored permanently and can be accessed at any time, from any location.
        </p>
        <p>
          The integration of Arweave’s API into this app allows the frontend to interact with the network seamlessly. We use the API to 
          generate the wallet, store data, and retrieve data as needed, ensuring that everything is permanently stored on the Arweave network.
        </p>

        <h3>5. <strong>Webpack</strong></h3>
        <p>
          Webpack is a powerful module bundler that helps optimize the assets used in the app. It bundles JavaScript, CSS, images, 
          and other files into optimized files that can be easily loaded by browsers. In modern web development, Webpack is essential for 
          managing complex assets and improving the performance of web applications.
        </p>
        <p>
          By using Webpack, we ensure that our app’s frontend is optimized for fast load times and minimal data usage, providing users 
          with a smooth experience.
        </p>

        <h3>6. <strong>Vercel</strong></h3>
        <p>
          Vercel is a platform that enables seamless deployment of Next.js applications. It is a cloud platform designed to help developers 
          deploy and manage web applications with minimal effort. Vercel automates the build and deployment processes, enabling rapid deployment 
          of updates and new features.
        </p>
        <p>
          Vercel’s integration with Next.js ensures that the application is optimized for performance and scalability, making it a perfect 
          choice for hosting our app.
        </p>
      </main>
      <footer>
        <p>&copy; 2025 Frontend Challenge | Powered by Arweave</p>
      </footer>
    </div>
  );
}
