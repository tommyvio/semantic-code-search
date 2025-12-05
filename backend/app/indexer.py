import os
import time
import chromadb
from chromadb.config import Settings as ChromaSettings
from typing import List, Dict, Any
from .config import settings
from .models import IndexResponse, CodeResult
from .embeddings import HuggingFaceEmbeddings

class CodeIndexer:
    def __init__(self):
        # Initialize ChromaDB
        self.chroma_client = chromadb.PersistentClient(path=settings.CHROMA_DB_PATH)
        self.collection = self.chroma_client.get_or_create_collection(
            name=settings.CHROMA_COLLECTION_NAME,
            metadata={"hnsw:space": "cosine"}
        )

        # Initialize Embedding Model (HuggingFace API)
        self.model = HuggingFaceEmbeddings()
    
    def index_repository(self, repo_path: str, languages: List[str] = None) -> IndexResponse:
        start_time = time.time()
        files_indexed = 0
        chunks_created = 0
        
        # Validate path
        if not os.path.exists(repo_path):
            raise FileNotFoundError(f"Repository path not found: {repo_path}")
            
        extensions = self._get_extensions_for_languages(languages)
        
        for root, _, files in os.walk(repo_path):
            # Skip hidden directories
            if '/.' in root or '\\.' in root:
                continue
                
            for file in files:
                if file.startswith('.'):
                    continue
                    
                file_path = os.path.join(root, file)
                _, ext = os.path.splitext(file)
                
                if extensions and ext not in extensions:
                    continue
                    
                try:
                    chunks = self._process_file(file_path)
                    if chunks:
                        self._store_chunks(chunks)
                        files_indexed += 1
                        chunks_created += len(chunks)
                except Exception as e:
                    print(f"Error processing {file_path}: {e}")
                    continue

        return IndexResponse(
            status="completed",
            files_indexed=files_indexed,
            chunks_created=chunks_created,
            time_taken=time.time() - start_time
        )

    def _get_extensions_for_languages(self, languages: List[str]) -> List[str]:
        if not languages:
            return None
            
        mapping = {
            "python": [".py"],
            "javascript": [".js", ".jsx"],
            "typescript": [".ts", ".tsx"],
            "go": [".go"],
            "java": [".java"],
            "cpp": [".cpp", ".h", ".hpp"],
            "c": [".c", ".h"],
            "rust": [".rs"]
        }
        
        exts = []
        for lang in languages:
            exts.extend(mapping.get(lang.lower(), []))
        return exts

    def _process_file(self, file_path: str) -> List[Dict[str, Any]]:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Simple chunking by double newline (functions/blocks) for now
            # In a full production app, we'd use tree-sitter or AST parsing
            raw_chunks = content.split('\n\n')
            
            chunks = []
            current_line = 1
            
            for chunk in raw_chunks:
                if not chunk.strip():
                    current_line += chunk.count('\n') + 2 # +2 for the split characters
                    continue
                
                chunk_lines = chunk.count('\n') + 1
                
                chunks.append({
                    "id": f"{file_path}:{current_line}",
                    "text": chunk,
                    "metadata": {
                        "file_path": file_path,
                        "language": self._detect_language(file_path),
                        "start_line": current_line,
                        "end_line": current_line + chunk_lines
                    }
                })
                
                current_line += chunk_lines + 1 # +1 for the gap
            
            return chunks
        except UnicodeDecodeError:
            return [] # Skip binary files

    def _store_chunks(self, chunks: List[Dict[str, Any]]):
        if not chunks:
            return
            
        texts = [c["text"] for c in chunks]
        metadatas = [c["metadata"] for c in chunks]
        ids = [c["id"] for c in chunks]

        embeddings = self.model.embed_documents(texts)
        
        self.collection.upsert(
            ids=ids,
            embeddings=embeddings,
            metadatas=metadatas,
            documents=texts
        )

    def _detect_language(self, file_path: str) -> str:
        _, ext = os.path.splitext(file_path)
        ext_map = {
            ".py": "python",
            ".js": "javascript",
            ".jsx": "javascript",
            ".ts": "typescript",
            ".tsx": "typescript",
            ".go": "go",
            ".java": "java",
            ".cpp": "cpp",
            ".c": "c",
            ".rs": "rust"
        }
        return ext_map.get(ext, "unknown")
