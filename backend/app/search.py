import time
import chromadb
import google.generativeai as genai
from sentence_transformers import SentenceTransformer
from typing import List, Dict, Any, Optional
from .config import settings
from .models import SearchResponse, CodeResult, ExplanationResponse

class CodeSearcher:
    def __init__(self):
        # Initialize ChromaDB
        self.chroma_client = chromadb.PersistentClient(path=settings.CHROMA_DB_PATH)
        self.collection = self.chroma_client.get_or_create_collection(
            name=settings.CHROMA_COLLECTION_NAME,
            metadata={"hnsw:space": "cosine"}
        )
        
        # Initialize Embedding Model
        self.model = SentenceTransformer(settings.EMBEDDING_MODEL)
        
        # Initialize Gemini if Key is present
        if settings.GEMINI_API_KEY:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            self.gemini_model = genai.GenerativeModel('gemini-pro')
        else:
            self.gemini_model = None

    def search(self, query: str, top_k: int = 10, filters: Dict = None) -> SearchResponse:
        start_time = time.time()
        
        # Helper to construct where clause
        where_clause = {}
        if filters:
            if filters.get("language_filter"):
                where_clause["language"] = {"$in": filters["language_filter"]}
            if filters.get("min_score"):
                # Chroma doesn't support min_score in 'where', handled post-query 
                pass

        # Generate embedding
        query_embedding = self.model.encode(query).tolist()
        
        # Search
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k,
            where=where_clause if where_clause else None
        )
        
        code_results = []
        if results['ids']:
            for i in range(len(results['ids'][0])):
                metadata = results['metadatas'][0][i]
                document = results['documents'][0][i]
                distance = results['distances'][0][i]
                score = 1 - distance # Convert cosine distance to similarity
                
                if filters and filters.get("min_score") and score < filters["min_score"]:
                    continue
                
                code_results.append(CodeResult(
                    code=document,
                    file_path=metadata['file_path'],
                    start_line=metadata['start_line'],
                    end_line=metadata['end_line'],
                    language=metadata['language'],
                    score=score,
                    function_name=None # Would need AST parsing for this
                ))

        return SearchResponse(
            results=code_results,
            query=query,
            total_results=len(code_results),
            search_time=time.time() - start_time
        )
        
    def get_stats(self) -> Dict[str, Any]:
        count = self.collection.count()
        # Peek to get a sample for language detection if needed, or query stats
        # For MVP, just returning count
        return {
            "total_documents_indexed": count,
            # detailed stats would require aggregation which is slow in Chroma without keeping separate counters
        }

    async def explain_code(self, code: str, query: str) -> str:
        if not self.gemini_model:
            return "AI Explanation unavailable (GEMINI_API_KEY not set)"
            
        try:
            prompt = f"""
            Explain this code snippet in the context of the user's query: "{query}"
            
            Code:
            ```
            {code}
            ```
            
            Provide a concise, plain English explanation of what this code does and how it relates to the query.
            """
            response = await self.gemini_model.generate_content_async(prompt)
            return response.text
        except Exception as e:
            return f"Error generating explanation: {str(e)}"
