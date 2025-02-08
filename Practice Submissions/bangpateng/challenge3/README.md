# Bang Pateng App Arweare
A wallet generator for Arweave, built using Next.js.

![screenshoot1](https://github.com/user-attachments/assets/6f9a7e0b-f191-4cc5-8ed7-891981c1bfc5)

#### Website Link : [BG Pateng V1 App](https://bang-pateng-app-arweare_arlink.arweave.net/)

## 🚀 1. Getting Started

1. **Clone this repository**:

   ```
   git clone https://github.com/bangpateng/Bang-Pateng-App-Arweare.git
   cd Bang-Pateng-App-Arweare
   ```

2. **Install dependencies**:

```
npm install
```

Run the application locally:

```
npm run dev
```

Open your browser and visit `http://localhost:3000`

## 🚀 2. Uploading to Your Own GitHub Repository
Follow these steps to upload this project to your own GitHub repository:

#### Step 1: Create a New Repository
- Go to GitHub and log in to your account.
- Click on the + (plus icon) in the top right corner and select "New repository".
- Enter a repository name (e.g., My-Arweave-Wallet).
- Choose visibility (Public/Private) and click "Create repository".

#### Step 2: Initialize Git in Your Local Project
If you haven't already initialized Git in your project, run the following commands:

```
git init
```

#### Step 3: Link Your Repository
Add your GitHub repository URL as the remote origin:

```
git remote add origin https://github.com/your-username/My-Arweave-Wallet.git
```

Replace your-username with your GitHub username and My-Arweave-Wallet with your repo name.

#### Step 4: Add and Commit Files
Add all project files to Git and commit the changes:

```
git add .
git commit -m "Initial commit"
```

#### Step 5: Push to GitHub
Upload your project to GitHub by pushing the committed files:

```
git branch -M main
git push -u origin main
```

If you are using a different branch name, replace main with your branch name.

#### Step 6: Verify Upload

- Go to your GitHub repository link and refresh the page.
- You should see all your project files uploaded.

#### Step 7: Future Updates
When you make changes and want to update your repository, run:

```
git add .
git commit -m "Update project with new features"
git push origin main
```

## 🚀 3. Deploying to ArLink
You can deploy this project to Arweave using ArLink by following these steps:

1. **Configure Next.js for Static Export**

Ensure that your next.config.js file contains the following configuration:

```
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  assetPrefix: "./",
  output: 'export',  // Enables static HTML export
  images: {
    unoptimized: true // Required for static export
  }
};

module.exports = nextConfig;
```

2. **Build the Project Locally**

Before deploying, you can test the build process locally with:

```
npm run build
```

3. **Deploying via ArLink Dashboard**

Follow these steps to deploy your project to Arweave using ArLink:

- Go to [ArLink Deployment](https://arlink.arweave.net/)
- Connect your [Arweave wallet](https://www.arconnect.io/download).
- Click "New Project" and enter your project details.
- In the repository URL, enter your GitHub repository link: `https://github.com/your-username/My-Arweave-Wallet.git`
- Set the Branch to main.
- Set the Root Directory to `./`
- Under Build And Output Settings, use the following values:

**Install command**: `npm install`
**Build command**: `npm run build`

- Output directory: `./out`
- Click Deploy now to start the deployment process.
- Once deployed, you will get a public URL where your application is accessible.

4. **Accessing the Deployed Site**

After deployment, your app will be accessible at:

```
https://your-link.arlink.ar.io/
```

![GitHub stars](https://img.shields.io/github/stars/bangpateng/Bang-Pateng-App-Arweare?style=social)
![GitHub forks](https://img.shields.io/github/forks/bangpateng/Bang-Pateng-App-Arweare?style=social)