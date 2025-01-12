# Simple Static Website with 11ty and Deployment to Arweave

This guide explains how to build a simple static website using 11ty (Eleventy) and deploy it to Arweave.

## Demo Site
[challenge2](https://m2577lv4kf3gwre4aetl7c5posgo5mcj4h2lcvh5wwtofxc7z6ca.arweave.net/Zrv_rrxRdmtEnAEmv4uvdIzusEnh9LFU_bWm4txfz4Q/index.html)

## Prerequisites
1. **Node.js**: Download and install from [Node.js](https://nodejs.org).
2. **Arweave Wallet**: Create one using [ArConnect](https://arconnect.io/) and ensure it has sufficient funds for deployment.

---

## Steps to Create the Website

### 1. Initialize the Project
Run the following commands to set up your project:
```bash
mkdir <your-project-name>
cd <your-project-name>
npm init -y
```

### 2. Install 11ty
Install 11ty in your project:
```bash
npm install @11ty/eleventy
```

### 3. Set Up Project Structure
Create the following folder and file structure:
```css
my-arweave-website/
├── .eleventy.js
├── package.json
├── src/
│   ├── _includes/
│   │   └── layout.njk
│   └── index.md
```

### 4. Add Layout File
Create `src/_includes/layout.njk`:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ title }}</title>
</head>
<body>
    {{ content | safe }}
</body>
</html>
```

### 5. Add Content File
Create `src/index.md`:
```bash
---
layout: layout.njk
title: My Arweave Website
---

# Welcome to My Arweave Website

This site is deployed to **Arweave**!
```

### 6. Add Configuration File
Create `./eleventy.js`:
```javascript
module.exports = function (eleventyConfig) {
  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "_site",
    },
  };
};
```

### 7. Build the Website
Run 11ty to generate the static file:
```bash
npx @11ty/eleventy
```
The generated site will be in the `_site` folder.

---

## Steps to Deploy to Arweave

### 1. Install Bundlr
Install Bundlr globally:
```bash
npm install -g @bundlr-network/client
```

### 2. Make Sure You Have a JSON Wallet
Download your wallet JSON file from ArConnect or another wallet service that supports Arweave. Save the file, for example as `wallet.json`, in your project directory.
`(make sure it is not uploaded to a public repository!)`.

### 3. Deploy the Website
Upload the `_site` folder to Arweave:
```bash
bundlr upload-dir ./_site --wallet ./wallet.json -h https://node1.bundlr.network --currency arweave
```

### 4. Get Deployment URL
After deployment, Bundlr will provide a URL like this:
```arduino
https://arweave.net/<transaction-id>
```

---

## Notes
- Ensure your wallet has sufficient funds for deployment.
- You can customize the content in `index.md` and the layout in `layout.njk` to suit your needs.

Happy building and deploying to Arweave!