# Semantic Code Search

> AI-Powered Codebase Search Engine

[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

## Overview

Semantic Code Search is a semantic search engine designed to enable natural language queries over source code repositories. Unlike traditional keyword-based search tools (grep), this system leverages high-dimensional vector embeddings to understand the intent and context of code, allowing users to find relevant functions and logic patterns even when exact keywords are missing.

The system is built on a modern microservices architecture, utilizing **FastAPI** for high-performance inference and **ChromaDB** for efficient vector storage and retrieval. The frontend is developed with **React** and **TypeScript**, providing a robust interface for interacting with the search engine.

## Technical Architecture

- **Embeddings**: Uses `sentence-transformers/all-MiniLM-L6-v2` (fine-tuned for semantic similarity) to convert code chunks into vector space.
- **Vector Store**: Implements **ChromaDB** for persistent storage and Approximate Nearest Neighbor (ANN) search.
- **Backend Service**: Asynchronous **FastAPI** application handling indexing pipelines and search queries.
- **Frontend**: **React** application with **Prism.js** for syntax highlighting and **TailwindCSS** for a responsive design system.

## Key Features

- **Semantic Querying**: Resolves natural language queries (e.g., "authentication middleware") to relevant code implementations.
- **Automated Indexing**: Recursively scans repositories, parses supported languages, and chunks content for embedding generation.
- **Multi-Language Support**: Configured parsers for Python, JavaScript, TypeScript, Go, Java, rust, C++, and C.
- **Real-time Analytics**: Monitors indexing metrics and corpus statistics.

## Quick Start

### Docker Deployment (Recommended)

The application is containerized for easy deployment.

```bash
docker-compose up --build
```

Access the application at `http://localhost:5173`.

### Manual Installation

**Backend**
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

**Frontend**
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## API Usage

### Indexing a Repository
```bash
curl -X POST http://localhost:8000/api/index \
  -H "Content-Type: application/json" \
  -d '{"repo_path": "/path/to/local/repo"}'
```

### Search Query
```bash
curl -X POST http://localhost:8000/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "database connection pool", "top_k": 5}'
```

## Deployment

### Railway (Backend)
The backend is configured for deployment on Railway with a persistent volume for the vector database.
1. Connect GitHub repository.
2. Set environment variables (`CHROMA_DB_PATH`, `CORS_ORIGINS`).
3. Attach a Volume at `/app/chroma_db`.

### Vercel (Frontend)
The frontend is configured for Vercel.
1. Import GitHub repository.
2. Set `VITE_API_URL` to the deployed backend URL.

## License

MIT License
