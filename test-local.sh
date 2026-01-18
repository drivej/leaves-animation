#!/bin/bash

# Script to test the leaves-and-snow package locally

echo "🧪 Testing leaves-and-snow locally..."
echo ""

# Check if test-app exists
if [ ! -d "test-app" ]; then
  echo "❌ test-app directory not found!"
  exit 1
fi

# Navigate to test-app
cd test-app

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if install was successful
if [ $? -ne 0 ]; then
  echo "❌ npm install failed!"
  exit 1
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 Starting dev server..."
echo "   Open http://localhost:5173 in your browser"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start dev server
npm run dev

