import requests
from typing import List
from .config import settings

class HuggingFaceEmbeddings:
    """Generate embeddings using HuggingFace Inference API"""

    def __init__(self):
        self.api_url = f"https://router.huggingface.co/pipeline/feature-extraction/{settings.EMBEDDING_MODEL}"
        self.headers = {"Authorization": f"Bearer {settings.HUGGINGFACE_API_KEY}"}

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for a list of documents"""
        response = requests.post(
            self.api_url,
            headers=self.headers,
            json={"inputs": texts, "options": {"wait_for_model": True}}
        )

        if response.status_code != 200:
            raise Exception(f"HuggingFace API error: {response.status_code} - {response.text}")

        return response.json()

    def embed_query(self, text: str) -> List[float]:
        """Generate embedding for a single query"""
        response = requests.post(
            self.api_url,
            headers=self.headers,
            json={"inputs": text, "options": {"wait_for_model": True}}
        )

        if response.status_code != 200:
            raise Exception(f"HuggingFace API error: {response.status_code} - {response.text}")

        return response.json()
