/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Sesuaikan dengan kebutuhan proyek
  assetPrefix: "./",
  output: 'export',  // Enables static HTML export
  images: {
    unoptimized: true // Required for static export
  }
};

module.exports = nextConfig;
