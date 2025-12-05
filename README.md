# 🔍 Semantic Code Search

> Search your codebase using natural language - powered by AI

[![Demo](https://img.shields.io/badge/demo-live-success)](https://semantic-code-search.vercel.app)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

![Semantic Code Search UI](https://your-placeholder-image-url.com/ui.png)

## ✨ What is this?

Semantic Code Search understands what your code **does**, not just what it's **named**. Search for "authentication logic" and find `verifyUser()`, `checkCredentials()`, and all related functions - even if they never mention "authentication."

### The Problem
Traditional code search (`grep`, GitHub search) only matches keywords. You miss relevant code with different naming.

### The Solution
AI-powered semantic search using CodeBERT embeddings. Understands code intent and context.

## 🎯 Features

- 🧠 **Natural Language Search** - "Find all database queries" just works
- ⚡ **Fast Vector Search** - ChromaDB for instant results
- 🎨 **Beautiful UI** - Dark mode, syntax highlighting, responsive
- 🔍 **Smart Filtering** - By language, file type, relevance score
- 📊 **Analytics** - Track what's indexed and search performance
- 🐳 **Docker Ready** - One command to run locally
- ☁️ **Cloud Deploy** - Vercel + Railway configs included

## 🚀 Quick Start

### Option 1: Docker (Recommended)
```bash
docker-compose up --build
```
Visit: http://localhost:5173

### Option 2: Manual Setup

**Backend:**
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## 📖 Usage

1. **Index a repository:**
```bash
curl -X POST http://localhost:8000/api/index \
  -H "Content-Type: application/json" \
  -d '{"repo_path": "/path/to/your/code"}'
```

2. **Search:**
```bash
curl -X POST http://localhost:8000/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "functions that handle authentication", "top_k": 10}'
```

Or use the beautiful web UI! 🎨

## 🛠️ Tech Stack

**Backend:**
- FastAPI - High-performance async API
- ChromaDB - Vector database
- CodeBERT - Pre-trained code embeddings
- Sentence Transformers - Embedding generation

**Frontend:**
- React + TypeScript - Type-safe UI
- Vite - Lightning-fast builds
- TailwindCSS - Beautiful styling
- Prism.js - Syntax highlighting

## 📦 Deployment

### Deploy to Railway (Backend)
```bash
railway login
railway init
railway up
```

### Deploy to Vercel (Frontend)
```bash
vercel --prod
```

## 🤝 Contributing

PRs welcome! See [CONTRIBUTING.md](CONTRIBUTING.md)

## 📄 License

MIT

---

Built with ❤️ for developers who deserve better than Ctrl+F
