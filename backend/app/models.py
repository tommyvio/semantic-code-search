from typing import List, Optional
from pydantic import BaseModel

class IndexRequest(BaseModel):
    repo_path: str
    languages: Optional[List[str]] = ["python", "javascript", "typescript", "go", "java", "cpp", "c", "rs"]

class IndexResponse(BaseModel):
    status: str
    files_indexed: int
    chunks_created: int
    time_taken: float

class SearchRequest(BaseModel):
    query: str
    top_k: int = 10
    language_filter: Optional[List[str]] = None
    min_score: float = 0.5

class CodeResult(BaseModel):
    code: str
    file_path: str
    start_line: int
    end_line: int
    language: str
    score: float
    function_name: Optional[str] = None

class SearchResponse(BaseModel):
    results: List[CodeResult]
    query: str
    total_results: int
    search_time: float

class ExplanationRequest(BaseModel):
    code: str
    query: str

class ExplanationResponse(BaseModel):
    explanation: str
