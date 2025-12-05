from huggingface_hub import InferenceClient
from typing import List
from .config import settings

class HuggingFaceEmbeddings:
    """Generate embeddings using HuggingFace Inference API"""

    def __init__(self):
        # Use InferenceClient which handles the new routing automatically
        self.client = InferenceClient(token=settings.HUGGINGFACE_API_KEY)

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for a list of documents"""
        try:
            # feature_extraction returns embeddings for text
            embeddings = []
            for text in texts:
                result = self.client.feature_extraction(text, model=settings.EMBEDDING_MODEL)
                embeddings.append(result.tolist() if hasattr(result, 'tolist') else result)
            return embeddings
        except Exception as e:
            raise Exception(f"HuggingFace API error: {str(e)}")

    def embed_query(self, text: str) -> List[float]:
        """Generate embedding for a single query"""
        try:
            result = self.client.feature_extraction(text, model=settings.EMBEDDING_MODEL)
            return result.tolist() if hasattr(result, 'tolist') else result
        except Exception as e:
            raise Exception(f"HuggingFace API error: {str(e)}")
