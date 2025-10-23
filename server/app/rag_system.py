import os
import json
from datetime import datetime
from typing import List, Dict, Any

class RAGSystem:
    def __init__(self, storage_path: str = "data/vector_store"):
        self.storage_path = storage_path
        self.documents = {}
        self.document_metadata = {}
        os.makedirs(storage_path, exist_ok=True)
        self._load_documents()
    
    def _load_documents(self):
        """Load documents from storage"""
        metadata_file = os.path.join(self.storage_path, "metadata.json")
        if os.path.exists(metadata_file):
            try:
                with open(metadata_file, 'r') as f:
                    data = json.load(f)
                    self.documents = data.get("documents", {})
                    self.document_metadata = data.get("metadata", {})
            except Exception as e:
                print(f"Error loading documents: {e}")
                self.documents = {}
                self.document_metadata = {}
    
    def _save_documents(self):
        """Save documents to storage"""
        metadata_file = os.path.join(self.storage_path, "metadata.json")
        try:
            data = {
                "documents": self.documents,
                "metadata": self.document_metadata,
                "last_updated": datetime.now().isoformat()
            }
            with open(metadata_file, 'w') as f:
                json.dump(data, f, indent=2)
        except Exception as e:
            print(f"Error saving documents: {e}")
    
    def add_document(self, doc_id: str, content: str, metadata: Dict = None):
        """Add a document to the RAG system"""
        self.documents[doc_id] = content
        
        # Store metadata
        if metadata is None:
            metadata = {}
        
        self.document_metadata[doc_id] = {
            "added_date": datetime.now().isoformat(),
            "content_length": len(content),
            "word_count": len(content.split()),
            **metadata
        }
        
        self._save_documents()
        print(f"✅ Document '{doc_id}' added to RAG system")
    
    def remove_document(self, doc_id: str):
        """Remove a document from the RAG system"""
        if doc_id in self.documents:
            del self.documents[doc_id]
        if doc_id in self.document_metadata:
            del self.document_metadata[doc_id]
        self._save_documents()
        print(f"✅ Document '{doc_id}' removed from RAG system")
    
    def list_documents(self) -> List[Dict]:
        """List all documents in the RAG system"""
        documents = []
        for doc_id, metadata in self.document_metadata.items():
            documents.append({
                "id": doc_id,
                "added_date": metadata.get("added_date", "Unknown"),
                "content_length": metadata.get("content_length", 0),
                "word_count": metadata.get("word_count", 0)
            })
        return documents
    
    def search_documents(self, query: str, top_k: int = 3) -> List[Dict]:
        """Search for relevant documents based on query"""
        # Simple keyword-based search (can be enhanced with proper vector search)
        query_lower = query.lower()
        results = []
        
        for doc_id, content in self.documents.items():
            content_lower = content.lower()
            
            # Simple relevance scoring based on keyword matches
            score = 0
            for word in query_lower.split():
                if len(word) > 3:  # Only consider words longer than 3 characters
                    score += content_lower.count(word) * len(word)
            
            if score > 0:
                results.append({
                    "doc_id": doc_id,
                    "score": score,
                    "content": content[:500] + "..." if len(content) > 500 else content,
                    "metadata": self.document_metadata.get(doc_id, {})
                })
        
        # Sort by score and return top_k results
        results.sort(key=lambda x: x["score"], reverse=True)
        return results[:top_k]
    
    def get_document_content(self, doc_id: str) -> str:
        """Get the content of a specific document"""
        return self.documents.get(doc_id, "")
    
    def get_paper_overview(self) -> Dict[str, Any]:
        """Get an overview of all papers in the system"""
        total_documents = len(self.documents)
        total_words = sum(meta.get("word_count", 0) for meta in self.document_metadata.values())
        total_chars = sum(meta.get("content_length", 0) for meta in self.document_metadata.values())
        
        # Get document statistics
        document_stats = []
        for doc_id, metadata in self.document_metadata.items():
            document_stats.append({
                "id": doc_id,
                "word_count": metadata.get("word_count", 0),
                "content_length": metadata.get("content_length", 0),
                "added_date": metadata.get("added_date", "Unknown")
            })
        
        # Sort by word count (largest first)
        document_stats.sort(key=lambda x: x["word_count"], reverse=True)
        
        return {
            "total_documents": total_documents,
            "total_words": total_words,
            "total_characters": total_chars,
            "documents": document_stats,
            "last_updated": datetime.now().isoformat()
        }
    
    def clear_all_documents(self):
        """Clear all documents from the system"""
        self.documents = {}
        self.document_metadata = {}
        self._save_documents()
        print("✅ All documents cleared from RAG system")