const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Definisi content type yang lebih lengkap sesuai struktur folder Anda
const contentTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  // Tambahan untuk fancybox dan jquery
  '.min.css': 'text/css',
  '.min.js': 'application/javascript'
};

const keyFile = "C:/Users/twenty-one/Downloads/arweave-keyfile-TP2PD4iaY57X68nd75CpMOHaXtBK2nMVSVyslBGLzyU.json";
const publicDir = './public';

function getContentType(filePath) {
  // Handling untuk file .min.css dan .min.js
  if (filePath.endsWith('.min.css')) return 'text/css';
  if (filePath.endsWith('.min.js')) return 'application/javascript';
  
  const ext = path.extname(filePath);
  return contentTypes[ext] || 'application/octet-stream';
}

function deployFile(filePath) {
  const contentType = getContentType(filePath);
  const relativePath = path.relative(publicDir, filePath);
  
  const command = `arweave deploy "${filePath}" --key-file "${keyFile}" --tags "Content-Type=${contentType}"`;
  
  try {
    console.log(`\nDeploying: ${relativePath}`);
    console.log(`Content-Type: ${contentType}`);
    execSync(command, { stdio: 'inherit' });
    console.log(`✓ Successfully deployed: ${relativePath}`);
  } catch (error) {
    console.error(`✗ Error deploying ${relativePath}:`, error.message);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else {
      deployFile(filePath);
    }
  });
}

console.log('=== Starting Deployment ===');
console.log('Structure to be deployed:');

// Menampilkan struktur folder yang akan di-deploy
function displayStructure(dir, prefix = '') {
  const files = fs.readdirSync(dir);
  files.forEach((file, index) => {
    const filePath = path.join(dir, file);
    const isLast = index === files.length - 1;
    const stat = fs.statSync(filePath);
    
    console.log(`${prefix}${isLast ? '└── ' : '├── '}${file}`);
    
    if (stat.isDirectory()) {
      displayStructure(filePath, `${prefix}${isLast ? '    ' : '│   '}`);
    }
  });
}

displayStructure(publicDir);
console.log('\nStarting file deployment...');
walkDir(publicDir);
console.log('\n=== Deployment Complete ===');