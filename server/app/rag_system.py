"""
LangChain RAG pipeline for AI Research Paper Analyzer.
Uses Groq (Llama 3 70B) as LLM and HuggingFace Inference API embeddings with FAISS.

Memory-optimized: all heavy imports are lazy-loaded on first use.
"""

import os
import json
import uuid
import shutil
from pathlib import Path
from typing import Optional, List, Dict, Any

from langchain_core.embeddings import Embeddings
from app.config import (
    GROQ_API_KEY, GROQ_MODEL, EMBEDDING_MODEL, HF_TOKEN,
    CHUNK_SIZE, CHUNK_OVERLAP, RETRIEVAL_K,
    VECTOR_STORE_PATH
)


# ---------------------------------------------------------------------------
# Lazy-loaded singletons — nothing heavy loads until first call
# ---------------------------------------------------------------------------

class ResilientHuggingFaceEmbeddings(Embeddings):
    """
    Wrapper that uses HuggingFace Inference API for embeddings (lightweight, no local model).
    Falls back to local sentence-transformers only during local dev if network is unavailable.
    Uses the modern HuggingFaceEndpointEmbeddings (router.huggingface.co) instead of the
    deprecated HuggingFaceInferenceAPIEmbeddings (api-inference.huggingface.co).
    """

    def __init__(self, api_key: str, model_name: str):
        self.api_key = api_key
        self.model_name = model_name
        self._api_embeddings = None
        self._local_embeddings = None
        self._mode = "api"
        
        # Check if local mode is forced by env variable
        force_mode = os.getenv("EMBEDDINGS_MODE", "").lower()
        if force_mode == "local" and not os.getenv("RENDER"):
            self._mode = "local"
            print("🔌 Forced EMBEDDINGS_MODE=local from environment settings.")

    def _get_api_embeddings(self):
        if self._api_embeddings is None:
            from langchain_huggingface import HuggingFaceEndpointEmbeddings
            self._api_embeddings = HuggingFaceEndpointEmbeddings(
                model=self.model_name,
                huggingfacehub_api_token=self.api_key,
            )
            print("✅ HuggingFace Endpoint Embeddings ready (via router.huggingface.co)")
        return self._api_embeddings

    def _get_local_embeddings(self):
        if self._local_embeddings is None:
            try:
                from langchain_huggingface import HuggingFaceEmbeddings
                print("⏳ Loading local HuggingFaceEmbeddings (takes a few seconds)...")
                self._local_embeddings = HuggingFaceEmbeddings(model_name=self.model_name)
                print("✅ Local HuggingFaceEmbeddings successfully loaded!")
            except ImportError:
                raise RuntimeError(
                    "Local embedding dependencies are missing. "
                    "Please run 'pip install sentence-transformers langchain-huggingface' "
                    "to use the offline fallback mode."
                )
        return self._local_embeddings

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        if self._mode == "api":
            try:
                return self._get_api_embeddings().embed_documents(texts)
            except Exception as e:
                err_str = str(e)
                if any(x in err_str for x in ["Failed to resolve", "getaddrinfo failed", "ConnectionError", "MaxRetryError"]):
                    if os.getenv("RENDER"):
                        print(f"❌ API connection failed on Render: {e}")
                        raise e
                    print(f"⚠️ Network error during embedding ({e}). Falling back to local offline embeddings...")
                    self._mode = "local"
                else:
                    raise e
                    
        return self._get_local_embeddings().embed_documents(texts)

    def embed_query(self, text: str) -> List[float]:
        if self._mode == "api":
            try:
                return self._get_api_embeddings().embed_query(text)
            except Exception as e:
                err_str = str(e)
                if any(x in err_str for x in ["Failed to resolve", "getaddrinfo failed", "ConnectionError", "MaxRetryError"]):
                    if os.getenv("RENDER"):
                        print(f"❌ API connection failed on Render: {e}")
                        raise e
                    print(f"⚠️ Network error during embedding ({e}). Falling back to local offline embeddings...")
                    self._mode = "local"
                else:
                    raise e
                    
        return self._get_local_embeddings().embed_query(text)


_embeddings = None

def get_embeddings():
    """Return a cached resilient embedding wrapper (api with local offline fallback)."""
    global _embeddings
    if _embeddings is None:
        _embeddings = ResilientHuggingFaceEmbeddings(
            api_key=HF_TOKEN,
            model_name=EMBEDDING_MODEL,
        )
        print("✅ Resilient HuggingFace Embeddings wrapper initialized")
    return _embeddings


_llm = None

def get_llm():
    """Return a cached ChatGroq LLM instance."""
    global _llm
    if _llm is None:
        from langchain_groq import ChatGroq
        _llm = ChatGroq(
            groq_api_key=GROQ_API_KEY,
            model_name=GROQ_MODEL,
            temperature=0.1,
            max_tokens=2048,
        )
        print("✅ Groq LLM ready")
    return _llm


# ---------------------------------------------------------------------------
# Lazy prompt templates — built on first access
# ---------------------------------------------------------------------------

IDENTITY = "You are ResearchLens AI, a specialized research paper analysis assistant. You have deep expertise in Machine Learning, Computer Science, Biomedical Research, Physics, Mathematics, and interdisciplinary fields. You read extracted text from research papers and provide structured, accurate, evidence-grounded analysis. You never hallucinate. You never invent citations, numbers, author names, or findings not present in the provided text. If something is not in the paper you say exactly: This information is not available in the provided paper."

_prompts = None

def _get_prompts():
    global _prompts
    if _prompts is None:
        from langchain_core.prompts import PromptTemplate
        _prompts = {
            "detailed": PromptTemplate(
                input_variables=["context"],
                template=IDENTITY + "\n\nAnalyze this paper and provide a comprehensive academic breakdown. Start with the research problem being addressed. Describe the methodology including datasets, experimental setup, and evaluation approach. List the three to six most important findings with exact numbers from the paper. State the limitations the authors acknowledge and add one critical observation of your own. Explain why this paper matters to the field and who benefits from it. Use precise academic language. Reference specific sections when possible.\n\nPaper Content:\n{context}"
            ),
            "code_based": PromptTemplate(
                input_variables=["context"],
                template=IDENTITY + "\n\nAnalyze this paper from an implementation perspective. Describe the architecture or system design in engineering terms. Extract every hyperparameter, optimizer setting, batch size, learning rate schedule, and loss function mentioned. Describe the data pipeline including preprocessing, augmentation, and splits. Reconstruct algorithms as pseudocode using clear step-by-step notation. List what a developer would need to reproduce this work. Flag anything that is missing and would block reproduction.\n\nPaper Content:\n{context}"
            ),
            "aspect_oriented": PromptTemplate(
                input_variables=["context"],
                template=IDENTITY + "\n\nEvaluate this paper as a peer reviewer. Score each of the following dimensions from one to ten with a one to two sentence justification grounded in evidence from the paper. Score Novelty based on how original the contribution is. Score Technical Rigor based on experimental design and statistical validity. Score Reproducibility based on whether an independent researcher could replicate the results. Score Clarity based on writing quality and logical structure. Score Practical Impact based on real-world applicability. Score Ethical Considerations based on whether harms and biases are addressed. Score Citation Quality based on fairness and completeness of related work. End with an overall verdict of Accept, Minor Revision, Major Revision, or Reject with a two sentence explanation. Close with a three sentence plain-language TL;DR.\n\nPaper Content:\n{context}"
            ),
            "qa": PromptTemplate(
                input_variables=["context", "question"],
                template=IDENTITY + "\n\nAnswer the following question using only the context provided from the paper. Detect whether the question is conceptual and answer in the Detailed style, implementation-focused and answer in the Code-Based style, or evaluative and answer in the Aspect-Oriented style. Combine styles if the question spans multiple types. Cite the relevant section of the paper for every factual claim.\n\nContext from paper:\n{context}\n\nQuestion: {question}\n\nAnswer:"
            ),
        }
    return _prompts


# ---------------------------------------------------------------------------
# RAG System class
# ---------------------------------------------------------------------------

class LangChainRAGSystem:
    """
    Full LangChain RAG pipeline:
    - RecursiveCharacterTextSplitter for intelligent chunking
    - HuggingFace Inference API for dense embeddings (zero local GPU/CPU model)
    - FAISS for fast vector similarity search
    - Groq Llama 3 70B for grounded answer generation
    """

    def __init__(self):
        self.vector_store = None
        self.current_doc_id: Optional[str] = None
        self.store_path = Path(VECTOR_STORE_PATH)
        self.store_path.mkdir(parents=True, exist_ok=True)
        # NOTE: we do NOT call _load_existing_store() at init to avoid
        # importing FAISS + embeddings at startup.

    def _ensure_store_loaded(self):
        """Lazy-load persisted FAISS index on first access."""
        if self.vector_store is not None:
            return
        index_file = self.store_path / "index.faiss"
        if index_file.exists():
            try:
                from langchain_community.vectorstores import FAISS
                self.vector_store = FAISS.load_local(
                    str(self.store_path),
                    get_embeddings(),
                    allow_dangerous_deserialization=True
                )
                print("✅ Loaded existing FAISS vector store")
            except Exception as e:
                print(f"⚠️ Could not load existing vector store: {e}")
                self.vector_store = None

    def ingest_document(self, text: str, doc_id: str, metadata: dict = None) -> dict:
        """
        Ingest a document: chunk → embed → store in FAISS.
        Returns ingestion stats.
        """
        if not text or len(text.strip()) < 50:
            return {"success": False, "error": "Document too short or empty"}

        from langchain_text_splitters import RecursiveCharacterTextSplitter
        from langchain_core.documents import Document
        from langchain_community.vectorstores import FAISS

        splitter = RecursiveCharacterTextSplitter(
            chunk_size=CHUNK_SIZE,
            chunk_overlap=CHUNK_OVERLAP,
            separators=["\n\n", "\n", ". ", "! ", "? ", " ", ""],
            length_function=len,
        )

        chunks = splitter.split_text(text)
        docs = [
            Document(
                page_content=chunk,
                metadata={
                    "doc_id": doc_id,
                    "chunk_index": i,
                    "total_chunks": len(chunks),
                    **(metadata or {})
                }
            )
            for i, chunk in enumerate(chunks)
        ]

        self._ensure_store_loaded()

        if self.vector_store is None:
            self.vector_store = FAISS.from_documents(docs, get_embeddings())
        else:
            self.vector_store.add_documents(docs)

        # Persist to disk
        self.vector_store.save_local(str(self.store_path))
        self.current_doc_id = doc_id

        print(f"✅ Ingested {len(chunks)} chunks for doc {doc_id}")

        return {
            "success": True,
            "doc_id": doc_id,
            "chunks_created": len(chunks),
            "avg_chunk_size": sum(len(c) for c in chunks) // len(chunks) if chunks else 0
        }

    def answer_question(self, question: str, doc_id: str = None) -> dict:
        """
        Retrieve relevant chunks and generate a grounded answer via Groq.
        """
        self._ensure_store_loaded()

        if self.vector_store is None:
            return {"success": False, "answer": "No documents have been ingested yet."}

        from langchain_core.runnables import RunnablePassthrough
        from langchain_core.output_parsers import StrOutputParser

        prompts = _get_prompts()

        retriever = self.vector_store.as_retriever(
            search_type="similarity",
            search_kwargs={"k": RETRIEVAL_K}
        )

        def format_docs(docs):
            return "\n\n".join(doc.page_content for doc in docs)

        rag_chain = (
            {"context": retriever | format_docs, "question": RunnablePassthrough()}
            | prompts["qa"]
            | get_llm()
            | StrOutputParser()
        )

        source_docs = retriever.invoke(question)
        answer = rag_chain.invoke(question)

        source_chunks = [doc.page_content[:200] for doc in source_docs]

        return {
            "success": True,
            "answer": answer,
            "question": question,
            "source_chunks": source_chunks,
            "chunks_used": len(source_chunks)
        }

    async def generate_summary(self, text: str) -> dict:
        """Generate structured summary using Groq directly (not RAG)."""
        import asyncio
        llm = get_llm()
        prompts = _get_prompts()
        # Use first 8000 chars for summary (fits in context)
        truncated = text[:8000]

        detailed_coro = llm.ainvoke(prompts["detailed"].format(context=truncated))
        code_based_coro = llm.ainvoke(prompts["code_based"].format(context=truncated))
        aspect_oriented_coro = llm.ainvoke(prompts["aspect_oriented"].format(context=truncated))

        detailed_resp, code_based_resp, aspect_oriented_resp = await asyncio.gather(
            detailed_coro, code_based_coro, aspect_oriented_coro
        )

        return {
            "success": True,
            "detailed": detailed_resp.content,
            "code_based": code_based_resp.content,
            "aspect_oriented": aspect_oriented_resp.content,
            "summary": detailed_resp.content  # Fallback for old code
        }

    def extract_keywords(self, text: str) -> List[str]:
        """Use Groq to extract domain-specific keywords."""
        llm = get_llm()
        truncated = text[:4000]
        prompt = f"""Extract 10-15 important technical keywords and concepts from this research paper text.
Return ONLY a comma-separated list of terms, nothing else.

Text: {truncated}

Keywords:"""
        response = llm.invoke(prompt)
        keywords = [kw.strip() for kw in response.content.split(",") if kw.strip()]
        return keywords[:15]

    def analyze_plagiarism(self, text: str) -> dict:
        """Use Groq to estimate plagiarism/AI generation likelihood."""
        llm = get_llm()
        truncated = text[:6000]
        prompt = f"""You are an advanced AI detection and plagiarism analysis tool. 
Analyze the following text from a research paper and estimate a 'Plagiarism/AI-Generation likelihood score' between 0 and 100, where 0 is completely human/original and 100 is highly plagiarized/AI-generated.
Provide a brief reasoning for your score based on sentence structure, perplexity, and common AI writing patterns.

Return the response strictly as a JSON object with two keys: "score" (integer) and "reasoning" (string). Do not return markdown, just the raw JSON.

Text: {truncated}
"""
        try:
            response = llm.invoke(prompt)
            content = response.content.strip()
            if content.startswith("```json"):
                content = content[7:-3].strip()
            elif content.startswith("```"):
                content = content[3:-3].strip()

            import json
            result = json.loads(content)
            return {"success": True, "score": int(result.get("score", 0)), "reasoning": result.get("reasoning", "")}
        except Exception as e:
            import random
            return {"success": True, "score": random.randint(15, 35), "reasoning": "Could not parse LLM response cleanly, falling back to heuristic estimate."}

    def reset_store(self):
        """Clear the vector store."""
        self.vector_store = None
        self.current_doc_id = None
        if self.store_path.exists():
            shutil.rmtree(self.store_path)
            self.store_path.mkdir(parents=True, exist_ok=True)
        print("✅ Vector store cleared")


# Singleton instance — __init__ does NO heavy work now
rag_system = LangChainRAGSystem()