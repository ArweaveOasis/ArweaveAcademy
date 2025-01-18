### Frontend Challenge 4: Hash-Based SPA Routing

- **Decription**  
This is a simple React-based Crypto App that allows you to view and search for information on the top 100 cryptocurrencies. The app provides various functionalities, including listing the first 100 coins, searching for specific coins, refreshing the data without reloading the page, and displaying detailed information for each coin. The app uses Hash-Based SPA Routing to manage navigation between different views, such as the coin list, search results, and detailed coin pages. By using hash fragments in the URL (e.g., #/coin/bitcoin), the app ensures seamless navigation without requiring server-side support, making it lightweight and easy to deploy, especially in environments where server-side routing is not possible, such as decentralized storage systems like Arweave.
- **Why?**  
Why? This routing method is easy to implement and aligns perfectly with Arweave’s permanent storage model, as AR.IO gateways cannot execute server-side code. Hash-Based SPA Routing ensures seamless navigation entirely on the client side, making it an ideal choice for small, interactive applications like crypto apps or identity websites. Since it doesn't rely on server-side logic, it simplifies deployment and is well-suited for environments where simplicity and lightweight architecture are prioritized over SEO optimization.
- **Tools**  
React, Arlink & ArNS
- **Live View** 
Regular Deployment: https://ascapp_arlink.arweave.net/
Undername ArNS: ascapp_ascairdropasc.ar.io/