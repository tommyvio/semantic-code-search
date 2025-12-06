# Semantic Code Search

> AI-powered natural language search for codebases using vector embeddings

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://semantic-code-search.vercel.app)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.11-blue)](https://www.python.org/)
[![React](https://img.shields.io/badge/react-18.2-blue)](https://react.dev/)

## Live Demo

**Try it now:** [semantic-code-search.vercel.app](https://semantic-code-search.vercel.app)

Upload a ZIP file of your code and search using natural language queries like:
- "authentication functions"
- "database error handling"
- "JWT token generation"

## Features

- **Semantic Understanding** - Search by meaning, not just keywords
- **Lightning Fast** - Search results in ~50-60ms (vector similarity search)
- **ZIP Upload** - Drag & drop your codebase (no GitHub integration needed)
- **Syntax Highlighting** - Beautiful code display with Prism.js
- **Rate Limited** - Protected against abuse (10 uploads/hour, 50 searches/hour)
- **Multi-Language** - Python, JavaScript, TypeScript, Go, Java, Rust, C++, C

## Architecture

### Tech Stack

**Backend:**
- FastAPI (Python 3.11)
- ChromaDB (vector database)
- HuggingFace Inference API (embeddings)
- Sentence Transformers (`all-MiniLM-L6-v2`)

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- TailwindCSS (styling)
- Lucide React (icons)

**Deployment:**
- Backend: [Render](https://render.com) (free tier)
- Frontend: [Vercel](https://vercel.com)
- Database: Ephemeral (resets on restart)

### How It Works

1. **Upload** - User uploads ZIP file containing code
2. **Extract** - Backend extracts and scans for supported file types
3. **Chunk** - Code is split into semantic chunks (functions/blocks)
4. **Embed** - HuggingFace API generates 384-dim vectors for each chunk
5. **Store** - Vectors stored in ChromaDB with metadata
6. **Search** - User query is embedded and similarity search finds matches
7. **Results** - Ranked results with score, file path, and syntax highlighting

## Use Cases

- **Code Review** - "Find all authentication checks"
- **Onboarding** - "Show me database connection code"
- **Refactoring** - "Where do we handle errors?"
- **Learning** - "How is JWT implemented here?"

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- HuggingFace API key (free tier)

### Local Development

**1. Clone the repository**
```bash
git clone https://github.com/tommyvio/semantic-code-search.git
cd semantic-code-search
```

**2. Backend Setup**
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Edit .env and add your HUGGINGFACE_API_KEY
uvicorn app.main:app --reload
```

**3. Frontend Setup**
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env: VITE_API_URL=http://localhost:8000
npm run dev
```

Visit `http://localhost:5173`

## AI Code Explanation (Optional)

The frontend includes an "Explain AI" button, but requires your own API key to function.

**To enable AI explanations:**
1. Get a Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add to your `.env` file:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```
3. Restart the backend

This feature uses Google's Gemini API to explain code snippets in plain English.

## API Documentation

**Base URL:** `https://semantic-code-search.onrender.com`

| Endpoint | Method | Description | Avg Response Time |
|----------|--------|-------------|-------------------|
| `/api/upload` | POST | Upload ZIP file and index code | ~20s (depends on file size) |
| `/api/search` | POST | Search indexed code with natural language | ~50-60ms |
| `/api/stats` | GET | Get indexing statistics | ~10ms |
| `/health` | GET | Check API health | ~5ms |

### Example: Search Request

```bash
curl -X POST https://semantic-code-search.onrender.com/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "authentication functions", "top_k": 5}'
```

**Response:**
```json
{
  "results": [
    {
      "code": "def authenticate_user(username, password)...",
      "file_path": "auth.py",
      "start_line": 1,
      "score": 0.87
    }
  ],
  "total_results": 3,
  "search_time": 0.057
}
```

See full API documentation: [API Docs](https://semantic-code-search.onrender.com/docs)

## Rate Limiting

To prevent abuse and protect API quotas:

- **Uploads:** 10 per IP per hour
- **Searches:** 50 per IP per hour

Exceeding limits returns `429 Too Many Requests`.

## Limitations

**Free Tier Constraints:**
- Database resets on server restart (ephemeral storage)
- 512MB RAM limit on Render free tier
- HuggingFace free tier: ~30k API calls/month
- No authentication (public demo)

**For Production:**
- Add persistent disk storage ($7/month on Render)
- Implement user authentication
- Use dedicated embedding server or local models
- Add Redis for rate limiting across instances

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) file for details

## Acknowledgments

- [HuggingFace](https://huggingface.co) for free inference API
- [ChromaDB](https://www.trychroma.com/) for vector database
- [Sentence Transformers](https://www.sbert.net/) for embeddings
- [FastAPI](https://fastapi.tiangolo.com/) for backend framework

## Contact

Created by [@tommyvio](https://github.com/tommyvio)

---

Note: This is a demo project. The database resets periodically on the free tier. For production use, upgrade to persistent storage.

