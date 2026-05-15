"""
AI Research Paper Analyzer — FastAPI Backend
Powered by LangChain + Groq (Llama 3 70B) + FAISS
"""

import os
import sys
sys.stdout.reconfigure(encoding='utf-8')
import uuid
from pathlib import Path
from contextlib import asynccontextmanager
from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import Optional
from datetime import datetime
import jwt

from app.pdf_processor import PDFProcessor
from app.image_processor import ImageProcessor
from app.rag_system import rag_system
from app.config import UPLOAD_PATH
from app.auth import router as auth_router

# --- Lifespan: Startup/Shutdown for MongoDB ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    from app import auth as auth_module
    auth_module.connect_db()
    yield
    # Shutdown
    auth_module.disconnect_db()

# --- App Setup ---
app = FastAPI(
    title="AI Research Paper Analyzer",
    description="RAG-powered paper analysis with Groq Llama 3 + LangChain",
    version="2.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/auth", tags=["auth"])

Path(UPLOAD_PATH).mkdir(parents=True, exist_ok=True)
pdf_processor = PDFProcessor()
image_processor = ImageProcessor()

print("🚀 AI Research Paper Analyzer v2.0.0")
print("🤖 LLM: Groq Llama 3 70B")
print("🔗 RAG: LangChain + FAISS")


@app.get("/")
async def root():
    return {
        "message": "AI Research Paper Analyzer API v2.0.0",
        "status": "active",
        "stack": {
            "llm": "groq/llama3-70b-8192",
            "rag": "langchain+faiss",
            "embeddings": "sentence-transformers/all-MiniLM-L6-v2"
        },
        "endpoints": {
            "health": "/health",
            "analyze_pdf": "/analyze-pdf",
            "analyze_image": "/analyze-image",
            "ask_question": "/ask-question",
            "documents": "/documents",
            "reset": "/reset"
        }
    }


@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "llm": "groq/llama3-70b-8192",
        "rag": "langchain+faiss",
        "version": "2.0.0"
    }


def _is_valid_pdf(file_path: str) -> bool:
    """Check if file is a valid PDF"""
    try:
        with open(file_path, "rb") as f:
            header = f.read(4)
            if header != b'%PDF':
                return False
            f.seek(0, 2)
            file_size = f.tell()
            if file_size < 100:
                return False
            return True
    except:
        return False


@app.post("/analyze-pdf")
async def analyze_pdf(
    file: UploadFile = File(...),
    question: Optional[str] = Form(None),
    authorization: Optional[str] = Header(None)
):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(400, "Only PDF files accepted")

    content = await file.read()
    doc_id = str(uuid.uuid4())
    save_path = Path(UPLOAD_PATH) / f"{doc_id}_{file.filename}"
    save_path.write_bytes(content)

    # Validate PDF
    if not _is_valid_pdf(str(save_path)):
        raise HTTPException(400, "Invalid or corrupted PDF file")

    # Extract text
    text = pdf_processor.extract_text(str(save_path))

    if not text or len(text.strip()) < 50:
        raise HTTPException(500, "PDF extraction returned insufficient text")

    print(f"📄 Extracted {len(text)} characters from {file.filename}")

    # Ingest into RAG
    ingest_result = rag_system.ingest_document(text, doc_id, {"filename": file.filename})

    # Generate summary + keywords via LLM
    summary_result = await rag_system.generate_summary(text)
    keywords = rag_system.extract_keywords(text)

    # Analyze plagiarism
    plagiarism_result = rag_system.analyze_plagiarism(text)

    # Optional question
    answer = None
    if question and question.strip():
        answer = rag_system.answer_question(question, doc_id)

    # Save to MongoDB
    user_email = None
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
        try:
            from app.auth import SECRET_KEY, ALGORITHM
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_email = payload.get("sub")
        except:
            pass
            
    from app import auth
    if auth.db is not None:
        paper_doc = {
            "doc_id": doc_id,
            "filename": file.filename,
            "user_email": user_email,
            "text_length": len(text),
            "extracted_text": text,
            "summary": summary_result,
            "keywords": keywords,
            "rag_stats": ingest_result,
            "plagiarism": plagiarism_result,
            "answer": answer,
            "created_at": datetime.utcnow()
        }
        await auth.db.papers.insert_one(paper_doc)

    return {
        "success": True,
        "doc_id": doc_id,
        "filename": file.filename,
        "text_length": len(text),
        "extracted_text": text,
        "summary": summary_result,
        "keywords": keywords,
        "rag_stats": ingest_result,
        "plagiarism": plagiarism_result,
        "answer": answer
    }


@app.post("/analyze-image")
async def analyze_image(
    file: UploadFile = File(...),
    question: Optional[str] = Form(None),
    authorization: Optional[str] = Header(None)
):
    content = await file.read()
    doc_id = str(uuid.uuid4())
    save_path = Path(UPLOAD_PATH) / f"{doc_id}_{file.filename}"
    save_path.write_bytes(content)

    # Use the image processor's OCR
    import base64
    image_data = base64.b64encode(content).decode('utf-8')
    analysis = image_processor.analyze_research_image(image_data)

    text = ""
    if (analysis.get("ocr_results", {}).get("success") and
        analysis["ocr_results"].get("extracted_text")):
        text = analysis["ocr_results"]["extracted_text"]

    if not text or len(text.strip()) < 20:
        return {
            "success": True,
            "doc_id": doc_id,
            "filename": file.filename,
            "text_length": 0,
            "extracted_text": "",
            "summary": "Could not extract sufficient text from the image for analysis.",
            "keywords": [],
            "rag_stats": {"success": False, "error": "Insufficient text from OCR"},
            "answer": None,
            "analysis": analysis
        }

    ingest_result = rag_system.ingest_document(text, doc_id, {"filename": file.filename})
    summary_result = await rag_system.generate_summary(text)
    keywords = rag_system.extract_keywords(text)
    plagiarism_result = rag_system.analyze_plagiarism(text)

    answer = None
    if question and question.strip():
        answer = rag_system.answer_question(question, doc_id)

    # Save to MongoDB
    user_email = None
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
        try:
            from app.auth import SECRET_KEY, ALGORITHM
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_email = payload.get("sub")
        except:
            pass
            
    from app import auth
    if auth.db is not None:
        paper_doc = {
            "doc_id": doc_id,
            "filename": file.filename,
            "user_email": user_email,
            "text_length": len(text),
            "extracted_text": text,
            "summary": summary_result,
            "keywords": keywords,
            "rag_stats": ingest_result,
            "plagiarism": plagiarism_result,
            "answer": answer,
            "created_at": datetime.utcnow()
        }
        await auth.db.papers.insert_one(paper_doc)

    return {
        "success": True,
        "doc_id": doc_id,
        "filename": file.filename,
        "text_length": len(text),
        "extracted_text": text,
        "summary": summary_result,
        "keywords": keywords,
        "rag_stats": ingest_result,
        "plagiarism": plagiarism_result,
        "answer": answer,
        "analysis": analysis
    }


@app.post("/ask-question")
async def ask_question(question: str = Form(...)):
    if not question.strip():
        raise HTTPException(400, "Question cannot be empty")
    result = rag_system.answer_question(question)
    return result


@app.post("/analyze-plagiarism")
async def analyze_plagiarism(text: str = Form(...)):
    if not text.strip():
        raise HTTPException(400, "Text cannot be empty")
    result = rag_system.analyze_plagiarism(text)
    return result


@app.get("/documents")
async def list_documents():
    uploads = Path(UPLOAD_PATH)
    docs = [
        {"filename": f.name, "size_kb": round(f.stat().st_size / 1024, 1)}
        for f in uploads.iterdir() if f.is_file()
    ]
    return {"success": True, "documents": docs, "count": len(docs)}


@app.delete("/reset")
async def reset_rag():
    rag_system.reset_store()
    return {"success": True, "message": "Vector store cleared"}


if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting AI Research Paper Analyzer API...")
    print("🌐 Server: http://localhost:8000")
    print("📚 Docs: http://localhost:8000/docs")
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)