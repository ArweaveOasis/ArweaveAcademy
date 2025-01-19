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
