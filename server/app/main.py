"""
AI Research Paper Analyzer — FastAPI Backend
Powered by LangChain + Groq (Llama 3 70B) + FAISS

Memory-optimized: all heavy imports are lazy-loaded.
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


# ---------------------------------------------------------------------------
# Lazy-loaded heavy modules — NOT imported at module level to save ~300MB RAM
# ---------------------------------------------------------------------------

_pdf_processor = None

def get_pdf_processor():
    global _pdf_processor
    if _pdf_processor is None:
        from app.pdf_processor import PDFProcessor
        _pdf_processor = PDFProcessor()
        print("📄 PDFProcessor loaded")
    return _pdf_processor


_image_processor = None

def get_image_processor():
    global _image_processor
    if _image_processor is None:
        from app.image_processor import ImageProcessor
        _image_processor = ImageProcessor()
        print("🖼️ ImageProcessor loaded")
    return _image_processor


_rag = None

def get_rag():
    global _rag
    if _rag is None:
        from app.rag_system import rag_system
        _rag = rag_system
        print("🧠 RAG system loaded")
    return _rag


# ---------------------------------------------------------------------------
# Lifespan: Startup/Shutdown for MongoDB
# ---------------------------------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup — only connect to MongoDB (lightweight)
    from app import auth as auth_module
    auth_module.connect_db()
    yield
    # Shutdown
    auth_module.disconnect_db()


# ---------------------------------------------------------------------------
# App Setup
# ---------------------------------------------------------------------------

app = FastAPI(
    title="AI Research Paper Analyzer",
    description="RAG-powered paper analysis with Groq Llama 3 + LangChain",
    version="2.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auth router — lightweight, no heavy deps
from app.auth import router as auth_router
app.include_router(auth_router, prefix="/api/auth", tags=["auth"])

# Ensure upload directory exists (lightweight)
from app.config import UPLOAD_PATH, CLOUDINARY_FOLDER
Path(UPLOAD_PATH).mkdir(parents=True, exist_ok=True)

print("🚀 AI Research Paper Analyzer v2.0.0 (memory-optimized)")


# ---------------------------------------------------------------------------
# Health check — MUST be first, returns instantly, no heavy imports
# ---------------------------------------------------------------------------

@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/")
async def root():
    return {
        "message": "AI Research Paper Analyzer API v2.0.0",
        "status": "active",
        "stack": {
            "llm": "groq/llama3-70b-8192",
            "rag": "langchain+faiss",
            "embeddings": "HF-inference-api/all-MiniLM-L6-v2"
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


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

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
    except Exception as e: print(f"An error occurred: {e}"); return False


# ---------------------------------------------------------------------------
# PDF Analysis
# ---------------------------------------------------------------------------

@app.post("/analyze-pdf")
async def analyze_pdf(
    file: UploadFile = File(...),
    question: Optional[str] = Form(None),
    authorization: Optional[str] = Header(None, convert_underscores=True)
):
    try:
        import magic
        file_type = magic.from_buffer(await file.read(2048), mime=True)
        if not file_type or not file_type.startswith('application/pdf'):
            raise HTTPException(400, "Only PDF files accepted")
    except ImportError:
        if not file.filename.endswith('.pdf'):
            raise HTTPException(400, "Only PDF files accepted")
    await file.seek(0)

    content = await file.read()
    doc_id = str(uuid.uuid4())
    save_path = Path(UPLOAD_PATH) / f"{doc_id}_{file.filename}"
    save_path.write_bytes(content)

    # Validate PDF
    if not _is_valid_pdf(str(save_path)):
        save_path.unlink(missing_ok=True)
        raise HTTPException(400, "Invalid or corrupted PDF file")

    # Extract text (requires local file) — lazy-loads PDFProcessor
    text = get_pdf_processor().extract_text(str(save_path))

    if not text or len(text.strip()) < 50:
        save_path.unlink(missing_ok=True)
        raise HTTPException(500, "PDF extraction returned insufficient text")

    print(f"📄 Extracted {len(text)} characters from {file.filename}")

    # Upload to Cloudinary (reset UploadFile position first)
    from app.cloudinary_service import upload_to_cloudinary
    await file.seek(0)
    cloud_result = await upload_to_cloudinary(
        file, folder=f"{CLOUDINARY_FOLDER}/papers"
    )
    cloudinary_url = cloud_result["secure_url"]
    cloudinary_public_id = cloud_result["public_id"]

    # Remove temporary local file — Cloudinary is now the source of truth
    save_path.unlink(missing_ok=True)

    # Ingest into RAG — lazy-loads rag_system + embeddings + FAISS
    rag = get_rag()
    ingest_result = rag.ingest_document(text, doc_id, {"filename": file.filename})

    # Generate summary + keywords via LLM
    summary_result = await rag.generate_summary(text)
    keywords = rag.extract_keywords(text)

    # Analyze plagiarism
    plagiarism_result = rag.analyze_plagiarism(text)

    # Optional question
    answer = None
    if question and question.strip():
        answer = rag.answer_question(question, doc_id)

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
            "cloudinary_url": cloudinary_url,
            "cloudinary_public_id": cloudinary_public_id,
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
        "cloudinary_url": cloudinary_url,
        "text_length": len(text),
        "extracted_text": text,
        "summary": summary_result,
        "keywords": keywords,
        "rag_stats": ingest_result,
        "plagiarism": plagiarism_result,
        "answer": answer
    }


# ---------------------------------------------------------------------------
# Image Analysis
# ---------------------------------------------------------------------------

@app.post("/analyze-image")
async def analyze_image(
    file: UploadFile = File(...),
    question: Optional[str] = Form(None),
    authorization: Optional[str] = Header(None, convert_underscores=True)
):
    content = await file.read()
    doc_id = str(uuid.uuid4())
    save_path = Path(UPLOAD_PATH) / f"{doc_id}_{file.filename}"
    save_path.write_bytes(content)

    # Use the image processor's OCR — lazy-loads ImageProcessor
    import base64
    image_data = base64.b64encode(content).decode('utf-8')
    analysis = get_image_processor().analyze_research_image(image_data)

    # Upload to Cloudinary (reset UploadFile position first)
    from app.cloudinary_service import upload_to_cloudinary
    await file.seek(0)
    cloud_result = await upload_to_cloudinary(
        file, folder=f"{CLOUDINARY_FOLDER}/images"
    )
    cloudinary_url = cloud_result["secure_url"]
    cloudinary_public_id = cloud_result["public_id"]

    # Remove temporary local file
    save_path.unlink(missing_ok=True)

    text = ""
    if (analysis.get("ocr_results", {}).get("success") and
        analysis["ocr_results"].get("extracted_text")):
        text = analysis["ocr_results"]["extracted_text"]

    if not text or len(text.strip()) < 20:
        # Still store the Cloudinary URL even if OCR failed
        from app import auth
        user_email = None
        if authorization and authorization.startswith("Bearer "):
            token = authorization.split(" ")[1]
            try:
                from app.auth import SECRET_KEY, ALGORITHM
                payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
                user_email = payload.get("sub")
            except:
                pass
        if auth.db is not None:
            paper_doc = {
                "doc_id": doc_id,
                "filename": file.filename,
                "user_email": user_email,
                "cloudinary_url": cloudinary_url,
                "cloudinary_public_id": cloudinary_public_id,
                "text_length": 0,
                "extracted_text": "",
                "summary": "Could not extract sufficient text from the image for analysis.",
                "keywords": [],
                "rag_stats": {"success": False, "error": "Insufficient text from OCR"},
                "answer": None,
                "created_at": datetime.utcnow()
            }
            await auth.db.papers.insert_one(paper_doc)

        return {
            "success": True,
            "doc_id": doc_id,
            "filename": file.filename,
            "cloudinary_url": cloudinary_url,
            "text_length": 0,
            "extracted_text": "",
            "summary": "Could not extract sufficient text from the image for analysis.",
            "keywords": [],
            "rag_stats": {"success": False, "error": "Insufficient text from OCR"},
            "answer": None,
            "analysis": analysis
        }

    rag = get_rag()
    ingest_result = rag.ingest_document(text, doc_id, {"filename": file.filename})
    summary_result = await rag.generate_summary(text)
    keywords = rag.extract_keywords(text)
    plagiarism_result = rag.analyze_plagiarism(text)

    answer = None
    if question and question.strip():
        answer = rag.answer_question(question, doc_id)

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
            "cloudinary_url": cloudinary_url,
            "cloudinary_public_id": cloudinary_public_id,
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
        "cloudinary_url": cloudinary_url,
        "text_length": len(text),
        "extracted_text": text,
        "summary": summary_result,
        "keywords": keywords,
        "rag_stats": ingest_result,
        "plagiarism": plagiarism_result,
        "answer": answer,
        "analysis": analysis
    }


# ---------------------------------------------------------------------------
# Q&A and Utilities
# ---------------------------------------------------------------------------

@app.post("/ask-question")
async def ask_question(question: str = Form(...)):
    if not question.strip():
        raise HTTPException(400, "Question cannot be empty")
    result = get_rag().answer_question(question)
    return result


@app.post("/analyze-plagiarism")
async def analyze_plagiarism(text: str = Form(...)):
    if not text.strip():
        raise HTTPException(400, "Text cannot be empty")
    result = get_rag().analyze_plagiarism(text)
    return result


@app.get("/documents")
async def list_documents():
    """List uploaded documents from MongoDB (files are stored in Cloudinary)."""
    from app import auth
    if auth.db is not None:
        cursor = auth.db.papers.find(
            {}, {"doc_id": 1, "filename": 1, "cloudinary_url": 1,
                 "text_length": 1, "created_at": 1, "_id": 0}
        ).sort("created_at", -1)
        docs = await cursor.to_list(length=200)
        # Serialize datetime for JSON
        for doc in docs:
            if doc.get("created_at"):
                doc["created_at"] = doc["created_at"].isoformat()
        return {"success": True, "documents": docs, "count": len(docs)}

    # Fallback to local listing if MongoDB is not available
    uploads = Path(UPLOAD_PATH)
    docs = [
        {"filename": f.name, "size_kb": round(f.stat().st_size / 1024, 1)}
        for f in uploads.iterdir() if f.is_file()
    ]
    return {"success": True, "documents": docs, "count": len(docs)}


@app.delete("/reset")
async def reset_rag():
    get_rag().reset_store()
    return {"success": True, "message": "Vector store cleared"}


if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting AI Research Paper Analyzer API...")
    print("🌐 Server: http://localhost:8000")
    print("📚 Docs: http://localhost:8000/docs")
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)