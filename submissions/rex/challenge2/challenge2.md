### Frontend Challenge 2: Static Site Generation

- **Decription**  
Build a simple website rendered at compile time and deploy it to Arweave.
- **Why?**  
Because it fits Arweave’s permanent storage model, and AR.IO gateways can’t execute server-side code. Use SSG for content-heavy websites that don’t change often.
- **Tools**  
Arx, Hexo, Eleventy, etc.

### code html & css
- **index.html**
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="styles.css">
  <title>Home - ARwave Oasis x Stars</title>
</head>
<body>
  <header class="header">
    <div class="logo">🌟 ARwave Oasis x Stars 🌟</div>
    <nav class="nav">
      <a href="index.html" class="nav-link active">Home</a>
      <a href="about.html" class="nav-link">About</a>
    </nav>
  </header>
  <main class="hero">
    <section class="hero-content">
      <h1 class="hero-title">Welcome to ARwaves</h1>
      <p class="hero-description">Experience the simplicity of an unfamiliar airdrop & unique task.</p>
      <a href="about.html" class="cta-button">Learn More</a>
    </section>
  </main>
  <footer class="footer">
    <p>&copy; 2025 CoolSite. 🌟🌟🌟🌟🌟 it's not bounty</p>
  </footer>
</body>
</html>

- **About.html**
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="styles.css">
  <title>About - ARwave Oasis x Stars Site</title>
</head>
<body>
  <header class="header">
    <div class="logo">🌟 ARwave Oasis x Stars 🌟</div>
    <nav class="nav">
      <a href="index.html" class="nav-link">Home</a>
      <a href="about.html" class="nav-link active">About</a>
    </nav>
  </header>
  <main class="about">
    <h1 class="about-title">About Us</h1>
    <p class="about-description">
      CoolSite is a minimalist & stylish website designed to leave an impression. 
      We blend simplicity with modern web design to create something unique.
    </p>
    <a href="index.html" class="cta-button">Back to Home</a>
  </main>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-info">
        <h3>Company Information</h3>
        <p>Address: 123 Dream Lane, Innovation City, 45678</p>
        <p>Email: <a href="mailto:contact@arwave.com">contact@arwave.com</a></p>
        <p>Phone: +1 (234) 567-8901</p>
      </div>
      <div class="footer-social">
        <h3>Follow Us</h3>
        <div class="social-icons">
          <a href="https://discord.com/invite/YGXJbuz44K" target="_blank" class="fab fa-discord" aria-label="Discord">🕹️ Discord</a>
        <a href="https://x.com/ArweaveOasis" target="_blank" class="fab fa-twitter" aria-label="Twitter">🐦 Twitter</a>
          <a href="https://github.com/permaweb/ao" target="_blank" class="fab fa-github" aria-label="Github">🌐 GitHUb</a>
        </div>
      </div>
    </div>
    <p>&copy; 2025 ARwaves. Happy Grinding!</p>
  </footer>
</body>
</html>

- **Style.css**
/* General Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Poppins', Arial, sans-serif;
  background: linear-gradient(120deg, #4facfe, #00f2fe);
  color: #ffffff;
  line-height: 1.6;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.3);
  position: sticky;
  top: 0;
  z-index: 1000;
  animation: fadeIn 1s ease-in-out;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  text-transform: uppercase;
  color: #ffffff;
}

.nav {
  display: flex;
  gap: 15px;
}

.nav-link {
  color: #ffffff;
  text-decoration: none;
  font-weight: 500;
  padding: 5px 10px;
  border-radius: 5px;
  transition: background 0.3s ease, transform 0.2s ease;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.nav-link.active {
  background: rgba(255, 255, 255, 0.3);
}

/* Hero Section */
.hero {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: 70vh;
  animation: slideUp 1.5s ease-in-out;
}

.hero-title {
  font-size: 3rem;
  font-weight: bold;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
  animation: zoomIn 2s ease-in-out;
}

.hero-description {
  font-size: 1.2rem;
  margin: 15px 0;
}

.cta-button {
  display: inline-block;
  background: #ffffff;
  color: #00f2fe;
  text-transform: uppercase;
  font-weight: bold;
  padding: 10px 20px;
  margin-top: 20px;
  border-radius: 25px;
  text-decoration: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.cta-button:hover {
  background: #00f2fe;
  color: #ffffff;
  transform: translateY(-3px);
}

/* About Section */
.about {
  text-align: center;
  padding: 40px 20px;
  animation: fadeIn 1.5s ease-in-out;
}

.about-title {
  font-size: 2.5rem;
  margin-bottom: 20px;
}

.about-description {
  font-size: 1.2rem;
  line-height: 1.8;
  max-width: 600px;
  margin: 0 auto 30px;
}

/* Footer Styles */
.footer {
  background: rgba(0, 0, 0, 0.3);
  color: #ffffff;
  padding: 30px 20px;
  text-align: center;
  margin-top: auto;
}

.footer-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.footer-info {
  text-align: center;
}

.footer-info a {
  color: #00f2fe;
  text-decoration: none;
}

.footer-info a:hover {
  text-decoration: underline;
}

.footer-social {
  text-align: center;
}

.social-icons {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.social-icon {
  color: #ffffff;
  text-decoration: none;
  font-weight: bold;
  font-size: 1rem;
  transition: transform 0.3s ease, color 0.3s ease;
}

.social-icon:hover {
  color: #00f2fe;
  transform: scale(1.1);
}

/* Responsive Footer */
@media (max-width: 768px) {
  .footer-container {
    flex-direction: column;
  }
}
/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes zoomIn {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-description {
    font-size: 1rem;
  }

  .about-title {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .nav {
    flex-direction: column;
    gap: 10px;
  }

  .cta-button {
    padding: 8px 15px;
  }
}

- **Build.sh**(optional)
#!/bin/bash
# Basic script to copy templates and generate static HTML files

# Clean build directory
rm -rf build
mkdir build

# Copy static files
cp -r styles.css build/

# Generate pages
cp index.html build/index.html
cp about.html build/about.html

echo "Static site built successfully in the 'build' folder!"
