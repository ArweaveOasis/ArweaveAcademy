# Frontend Challenge 1: File-Based Routing

Welcome to the first frontend challenge! This repository contains the code and instructions for Challenge 1, which focuses on creating a simple website using **file-based routing** and deploying it on Arweave. The goal of this challenge is to practice file organization and static site creation.

---

## Requirements

Before you begin, make sure you have the following tools installed on your system:

- **A text editor**: Use any code editor of your choice (VS Code, Sublime Text, etc.)
- **A browser**: For viewing your local site (Chrome, Firefox, etc.)
- **Arweave Deployment Tools**: Tools such as [Dragondeploy](https://dragondeploy.xyz), [ArLink](https://arlink.arweave.net), or others for deploying your site to Arweave.

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
cd /Arweave-Academy/submissions/challenge1
```

### Step 3: Open index.html
Since this is a static website, you can simply open the index.html file in your browser to view the website locally.

You can open it directly by double-clicking the index.html file, or by using the following command in your terminal:
```
open index.html

```

or on Linux:

```
xdg-open index.html
```

### Step 4: Make Changes (Optional)
If you'd like to make changes to the website, you can edit the HTML files in the project:

index.html for the homepage.
about.html for the "Why?" page.
tools.html for the "Tools" page.
assets/styles.css to adjust the styles.
The changes will be reflected immediately when you refresh your browser.


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

- **Project Name**: challenge1
- **Branch**: main
- **Install Command**: `npm --version`
- **Build Command**: `npm --version`
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