# Frontend Challenge 2: Static Site Generation

Welcome to the second frontend challenge! This repository contains the code and instructions for Challenge 2, which focuses on building a static website using Static Site Generation (SSG) and deploying it to Arweave. The goal of this challenge is to practice generating static websites at build time, making them fast, secure, and ready for permanent deployment on Arweave.

---

## Requirements

Before you begin, make sure you have the following tools installed on your system:

- **A text editor**: Use any code editor of your choice (VS Code, Sublime Text, etc.)
- **Node.js**: Make sure you have Node.js installed on your machine (preferably version 12 or above).
- **Arweave Deployment Tools**: Tools such as Arx, Hexo, or others for deploying your static site to Arweave.
---

## Running the Project Locally

### Step 1: Clone the Repository

Clone this repository to your local machine:

```
git clone https://github.com/naufalprtm/Arweave-Academy.git
```

### Step 2: Navigate to the Project Folder

Move into the project folder:
```
cd /Arweave-Academy/submissions/challenge2
```

### Step 3: Install Dependencies
This project uses Eleventy (11ty) to generate the static site. Install the necessary dependencies by running the following command
```
npm install

```

### Step 4: Build the Site
To generate the static files, run the following command:

```
npm run build

```

### Step 5: Serve the Site Locally
To view the site locally, use the following command to start a local server:


```
npm run serve

```
### Step 6: Make Changes (Optional)
If you'd like to make changes to the website, you can edit the following files:
- **src/index.njk** for the homepage.
- **src/about.njk** for the "Why?" page.
- **src/tools.njk** for the "Tools" page.
- **src/assets/styles.css** to adjust the styles.



# Deploying to Arweave

To deploy your static site to Arweave, follow these steps:

## Prerequisites

Before you begin, make sure you have:

- An Arweave wallet (ArConnect recommended)
- A GitHub account or Protocol Land account
- Your web application code ready to deploy

## Step 1: Connect Your Wallet

1. Visit the [ARlink Dashboard](https://arlink.io).
2. Click **"Connect Wallet"** in the top right corner.
3. Select your wallet provider (ArConnect recommended).
4. Authorize the connection when prompted.

If you don't have an Arweave wallet yet, we recommend installing [ArConnect](https://www.arconnect.io) first.

## Step 2: Create Your First Deployment

Choose your preferred deployment method:

- **GitHub Deploy**
- **Protocol Land Deploy**

1. Click **"New Deployment"** in the dashboard.
2. Select **"Import from GitHub"**.
3. Authorize ARlink in GitHub if prompted.
4. Choose your repository.

### Configure your build settings:

- **Project Name**: challenge2
- **Branch**: main
- **Install Command**: `npm install`
- **Build Command**: `npm run build`
- **Output Directory**: `.` 

## Step 3: Set Up Your Domain

Choose your preferred domain option:

- **Custom ArNS Name**
- **Existing ArNS**

1. Enable **"Custom ArNS Name"** in deployment settings.
2. Enter your preferred name (e.g., `Custom ArNS Name`).
3. Your application will be available at: `Custom ArNS Name.ar-io.dev`.

Custom names must be unique across ARlink. If your chosen name is taken, try adding a unique identifier.

## Step 4: Deploy

1. Review your deployment settings.
2. Click **"Deploy"** to start the build process.
3. Monitor the build progress in real-time.

Once complete, you'll receive:

- Arweave Transaction ID
- Deployment URL
- ArNS Domain (if configured)

# Demo

Soon