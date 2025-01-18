# Frontend Challenge 1: File-based Routing

## Description
Build a simple website with multiple HTML files that link to each other and deploy it on Arweave.

### Why?
This is the easiest way to build a website and fits Arweave’s permanent storage model, and AR.IO gateways can’t execute server-side code. Use it for very simple websites when additional tooling would create too much overhead.

### Tools
- DragonDeploy
- Arweave wallet (e.g., via ArConnect)

---

## Steps to Complete the Challenge

### Step 1: Create Project Folder Structure
Organize your project as follows:
frontend-challenge/
├── index.html
├── about.html
├── contact.html
├── css/
│   └── style.css
└── js/
    └── script.js


### Step 2: Write the HTML Files

#### index.html
html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Home</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <header>
    <nav>
      <a href="index.html">Home</a>
      <a href="about.html">About</a>
      <a href="contact.html">Contact</a>
      <button class="wallet">Select Wallet</button>
    </nav>
  </header>
  <main>
    <section class="hero">
      <h1>AORWAVE OASIS:</h1>
      <p>ARWEAVE OASIS</p>
    </section>
  </main>
</body>
</html>


#### about.html
html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>About</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <header>
    <nav>
      <a href="index.html">Home</a>
      <a href="about.html">About</a>
      <a href="contact.html">Contact</a>
      <button class="wallet">Select Wallet</button>
    </nav>
  </header>
  <main>
    <h1>About Us</h1>
    <p>This page provides information about our website.</p>
  </main>
</body>
</html>


#### contact.html
html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contact</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <header>
    <nav>
      <a href="index.html">Home</a>
      <a href="about.html">About</a>
      <a href="contact.html">Contact</a>
      <button class="wallet">Select Wallet</button>
    </nav>
  </header>
  <main>
    <h1>Contact Us</h1>
    <p>Reach out to us through this page.</p>
  </main>
</body>
</html>


### Step 3: Add CSS

#### style.css
css
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  color: #fff;
  background-color: #0b0d20;
}

header {
  background-color: #0f1624;
  padding: 1em 0;
  position: sticky;
  top: 0;
  z-index: 10;
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1em;
}

nav a {
  color: #fff;
  text-decoration: none;
  margin: 0 15px;
  font-size: 1.2em;
}

.wallet {
  background-color: #a8ff60;
  color: #000;
  border: none;
  padding: 0.5em 1em;
  cursor: pointer;
  font-size: 1em;
}

.hero {
  text-align: center;
  padding: 100px 20px;
  background-image: url('../images/space.jpg');
  background-size: cover;
  background-position: center;
}

.hero h1 {
  font-size: 2.5em;
  margin-bottom: 20px;
}

.hero p {
  font-size: 1.2em;
}


### Step 4: Deploy to Arweave

#### Install DragonDeploy
Install DragonDeploy CLI:
bash
npm install -g @dragon.deploy/cli


#### Obtain an Arweave Wallet
If you don’t have a wallet:
1. Create one using [ArConnect](https://www.arconnect.io/).
2. Download your wallet JSON file.

#### Deploy the Project
1. Navigate to your project folder:
   
bash
   cd frontend-challenge

2. Deploy the project using DragonDeploy:
   
bash
   dragondeploy deploy --wallet-path /path/to/your-wallet.json


#### Get the Public URL
Once deployed, DragonDeploy will provide the URL where your site is hosted on Arweave.

---

## Notes
- Arweave’s permanent storage ensures your website remains accessible forever once deployed.
- File-based routing makes the site lightweight and suitable for simple use cases.
