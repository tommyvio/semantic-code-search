#!/bin/bash

# Exit on error
set -e

echo "🧪 Testing Semantic Code Search locally..."

# Check if docker is running
if ! docker info > /dev/null 2>&1; then
  echo "Error: Docker is not running"
  exit 1
fi

# Build and Start services
echo "🐳 Starting services..."
docker compose up -d --build

# Wait for services
echo "⏳ Waiting for services to be ready..."
sleep 15

# Test backend health
echo "🏥 Checking Backend Health..."
curl -v http://localhost:8000/health

# Test indexing (using backend dir as test)
echo "📂 Testing Indexing..."
curl -X POST http://localhost:8000/api/index \
  -H "Content-Type: application/json" \
  -d '{"repo_path": "."}'

# Test search
echo "🔍 Testing Search..."
curl -X POST http://localhost:8000/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "index repository function", "top_k": 5}'

# Check frontend
echo "🎨 Checking Frontend..."
curl -I http://localhost:5173

echo "✅ Local testing complete! Visit http://localhost:5173"
