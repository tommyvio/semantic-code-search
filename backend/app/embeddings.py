from huggingface_hub import InferenceClient
from typing import List
import numpy as np
from .config import settings

class HuggingFaceEmbeddings:
    """Generate embeddings using HuggingFace Inference API"""

    def __init__(self):
        # InferenceClient with updated library handles new routing
        self.client = InferenceClient(token=settings.HUGGINGFACE_API_KEY)
        self.model = settings.EMBEDDING_MODEL

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for a list of documents"""
        embeddings = []
        for text in texts:
            try:
                result = self.client.feature_extraction(text, model=self.model)
                # Convert numpy array or list to standard list
                if isinstance(result, np.ndarray):
                    embeddings.append(result.tolist())
                elif isinstance(result, list):
                    embeddings.append(result)
                else:
                    embeddings.append(list(result))
            except Exception as e:
                raise Exception(f"HuggingFace API error: {str(e)}")
        return embeddings

    def embed_query(self, text: str) -> List[float]:
        """Generate embedding for a single query"""
        try:
            result = self.client.feature_extraction(text, model=self.model)
            # Convert numpy array or list to standard list
            if isinstance(result, np.ndarray):
                return result.tolist()
            elif isinstance(result, list):
                return result
            else:
                return list(result)
        except Exception as e:
            raise Exception(f"HuggingFace API error: {str(e)}")
