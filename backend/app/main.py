import uvicorn
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .models import IndexRequest, IndexResponse, SearchRequest, SearchResponse, ExplanationRequest, ExplanationResponse
from .indexer import CodeIndexer
from .search import CodeSearcher

app = FastAPI(
    title=settings.APP_NAME,
    description="Semantic Code Search API",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global instances
indexer = None
searcher = None

@app.on_event("startup")
async def startup_event():
    global indexer, searcher
    try:
        indexer = CodeIndexer()
        searcher = CodeSearcher()
        print("Successfully initialized ChromaDB and Models")
    except Exception as e:
        print(f"Error initializing backend: {e}")

@app.get("/health")
async def health_check():
    return {"status": "ok", "version": "1.0.0"}

@app.post("/api/index", response_model=IndexResponse)
async def index_repository(request: IndexRequest, background_tasks: BackgroundTasks):
    if not indexer:
        raise HTTPException(status_code=503, detail="Indexer not initialized")
    
    try:
        # For simplicity in this synchronous handler, we will run indexing inline 
        # but in production this should be a background task or celery job
        # Since the assignment asks for "robust", let's run it.
        # But wait, large repos will timeout. 
        # The prompt says "IndexResponse... Indexes a codebase". 
        # I'll run it synchronously for the MVP to ensure feedback, 
        # or I can use background_tasks if the user wants async. 
        # Given "IndexResponse" returns stats, it implies waiting.
        result = indexer.index_repository(request.repo_path, request.languages)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/search", response_model=SearchResponse)
async def search_code(request: SearchRequest):
    if not searcher:
        raise HTTPException(status_code=503, detail="Searcher not initialized")
    
    try:
        filters = {}
        if request.language_filter:
            filters["language_filter"] = request.language_filter
        if request.min_score:
            filters["min_score"] = request.min_score
            
        return searcher.search(request.query, request.top_k, filters)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/stats")
async def get_stats():
    if not searcher:
        raise HTTPException(status_code=503, detail="Searcher not initialized")
    return searcher.get_stats()

@app.post("/api/explain", response_model=ExplanationResponse)
async def explain_code(request: ExplanationRequest):
    if not searcher:
        raise HTTPException(status_code=503, detail="Searcher not initialized")
    
    explanation = await searcher.explain_code(request.code, request.query)
    return ExplanationResponse(explanation=explanation)

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
