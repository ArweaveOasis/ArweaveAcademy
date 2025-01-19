// Array of retro game image URLs (replace with actual image URLs)
const retroGameImages = [
  "https://example.com/retro-game1.jpg",
  "https://example.com/retro-game2.jpg",
  "https://example.com/retro-game3.jpg",
  "https://example.com/retro-game4.jpg"
];

// Select a random image from the array
const randomImage = retroGameImages[Math.floor(Math.random() * retroGameImages.length)];

// Apply the random image as the background
document.body.style.backgroundImage = `url('${randomImage}')`;
document.body.style.backgroundSize = "cover";
document.body.style.backgroundPosition = "center";
document.body.style.backgroundAttachment = "fixed";

