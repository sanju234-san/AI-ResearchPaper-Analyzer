import numpy as np
import json
import os
from typing import List, Dict, Any
import hashlib

class VectorStore:
    def __init__(self, storage_path: str = "data/vector_store"):
        self.storage_path = storage_path
        self.vectors = {}
        self.metadata = {}
        os.makedirs(storage_path, exist_ok=True)
        self._load_vectors()
    
    def _load_vectors(self):
        """Load vectors from storage"""
        vectors_file = os.path.join(self.storage_path, "vectors.json")
        if os.path.exists(vectors_file):
            try:
                with open(vectors_file, 'r') as f:
                    data = json.load(f)
                    self.vectors = data.get("vectors", {})
                    self.metadata = data.get("metadata", {})
            except Exception as e:
                print(f"Error loading vectors: {e}")
                self.vectors = {}
                self.metadata = {}
    
    def _save_vectors(self):
        """Save vectors to storage"""
        vectors_file = os.path.join(self.storage_path, "vectors.json")
        try:
            data = {
                "vectors": self.vectors,
                "metadata": self.metadata
            }
            with open(vectors_file, 'w') as f:
                json.dump(data, f, indent=2)
        except Exception as e:
            print(f"Error saving vectors: {e}")
    
    def _text_to_vector(self, text: str) -> List[float]:
        """Convert text to a simple vector representation"""
        # Simple bag-of-words like representation
        # In a real system, you'd use sentence transformers or similar
        words = text.lower().split()
        word_counts = {}
        for word in words:
            if len(word) > 2:  # Ignore very short words
                word_counts[word] = word_counts.get(word, 0) + 1
        
        # Create a simple vector (this is very basic)
        # A real implementation would use proper embeddings
        vector = [word_counts.get(word, 0) for word in sorted(word_counts.keys())]
        
        # Normalize
        magnitude = np.linalg.norm(vector)
        if magnitude > 0:
            vector = [v / magnitude for v in vector]
        
        return vector
    
    def _cosine_similarity(self, vec1: List[float], vec2: List[float]) -> float:
        """Calculate cosine similarity between two vectors"""
        if not vec1 or not vec2:
            return 0.0
        
        # Pad vectors to same length
        max_len = max(len(vec1), len(vec2))
        vec1_padded = vec1 + [0] * (max_len - len(vec1))
        vec2_padded = vec2 + [0] * (max_len - len(vec2))
        
        dot_product = np.dot(vec1_padded, vec2_padded)
        norm1 = np.linalg.norm(vec1_padded)
        norm2 = np.linalg.norm(vec2_padded)
        
        if norm1 == 0 or norm2 == 0:
            return 0.0
        
        return dot_product / (norm1 * norm2)
    
    def add_document(self, doc_id: str, content: str, metadata: Dict = None):
        """Add a document to the vector store"""
        vector = self._text_to_vector(content)
        self.vectors[doc_id] = vector
        
        if metadata is None:
            metadata = {}
        
        self.metadata[doc_id] = {
            "content_length": len(content),
            "word_count": len(content.split()),
            **metadata
        }
        
        self._save_vectors()
    
    def search_similar(self, query: str, top_k: int = 5) -> List[Dict]:
        """Search for similar documents"""
        query_vector = self._text_to_vector(query)
        results = []
        
        for doc_id, doc_vector in self.vectors.items():
            similarity = self._cosine_similarity(query_vector, doc_vector)
            if similarity > 0.1:  # Minimum similarity threshold
                results.append({
                    "doc_id": doc_id,
                    "similarity": similarity,
                    "metadata": self.metadata.get(doc_id, {})
                })
        
        # Sort by similarity and return top_k results
        results.sort(key=lambda x: x["similarity"], reverse=True)
        return results[:top_k]
    
    def get_document_count(self) -> int:
        """Get the number of documents in the vector store"""
        return len(self.vectors)