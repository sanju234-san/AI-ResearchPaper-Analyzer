from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
import requests
import base64
from dotenv import load_dotenv

# Import all your components
from app.pdf_processor import PDFProcessor
from app.image_processor import ImageProcessor
from app.llm_analyzer import LLMAnalyzer
from app.rag_system import RAGSystem
from app.vector_store import VectorStore

# Try to load .env file
load_dotenv()

# Check for Ollama configuration
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3")
OLLAMA_ENABLED = os.getenv("OLLAMA_ENABLED", "true").lower() == "true"

print("🔍 Checking Ollama configuration...")
print(f"OLLAMA_BASE_URL: {OLLAMA_BASE_URL}")
print(f"OLLAMA_MODEL: {OLLAMA_MODEL}")
print(f"OLLAMA_ENABLED: {OLLAMA_ENABLED}")

app = FastAPI(title="AI Research Paper Analyzer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("🚀 Initializing AI Research Paper Analyzer components...")

# Check if Ollama is available
def check_ollama_availability():
    """Check if Ollama is running and accessible"""
    if not OLLAMA_ENABLED:
        return False
    
    try:
        response = requests.get(f"{OLLAMA_BASE_URL}/api/tags", timeout=10)
        if response.status_code == 200:
            print("✅ Ollama server is running")
            models = response.json().get("models", [])
            if models:
                print("📋 Available Ollama models:")
                for model in models:
                    model_name = model.get("name", "Unknown")
                    print(f"   - {model_name}")
            return True
        else:
            print(f"⚠️ Ollama server responded with status: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Cannot connect to Ollama server: {e}")
        return False

OLLAMA_AVAILABLE = check_ollama_availability()

if OLLAMA_AVAILABLE:
    print(f"🤖 Ollama integration ENABLED with model: {OLLAMA_MODEL}")
else:
    print("⚠️ Ollama integration DISABLED - using local RAG system only")

# Initialize all components
try:
    pdf_processor = PDFProcessor()
    print("✅ PDF Processor initialized")
except Exception as e:
    print(f"❌ PDF Processor failed: {e}")
    pdf_processor = None

try:
    image_processor = ImageProcessor()
    print("✅ Image Processor initialized")
except Exception as e:
    print(f"❌ Image Processor failed: {e}")
    image_processor = None

try:
    llm_analyzer = LLMAnalyzer()
    print("✅ LLM Analyzer initialized")
except Exception as e:
    print(f"❌ LLM Analyzer failed: {e}")
    llm_analyzer = None

try:
    rag_system = RAGSystem()
    print("✅ RAG System initialized")
except Exception as e:
    print(f"❌ RAG System failed: {e}")
    rag_system = None

# Create necessary directories
os.makedirs("data/uploads", exist_ok=True)
os.makedirs("data/vector_store", exist_ok=True)

def call_ollama_api(prompt: str, context: str = None, document_type: str = "research") -> str:
    """Call Ollama local LLM API with smarter context handling"""
    if not OLLAMA_AVAILABLE:
        return "Ollama is not available. Please ensure Ollama is installed and running."
    
    try:
        # Check if context is citation metadata
        is_citation_context = False
        if context:
            context_lower = context.lower()
            citation_indicators = ["au -", "py -", "t1 -", "do -", "jo -", "author:", "title:", "journal:", "citation file", "bibliographic"]
            is_citation_context = any(indicator in context_lower for indicator in citation_indicators)
        
        # Build intelligent prompt based on context type
        if is_citation_context:
            full_prompt = f"""The user asked: "{prompt}"

Available context (this is citation metadata, not full paper content):
{context}

Please provide a helpful but accurate response. Clearly indicate that this is bibliographic metadata and not the full paper content. Do not speculate about the paper's actual content beyond what's provided in the metadata."""
        
        elif context and ("corrupted" in context.lower() or "partial" in context.lower()):
            full_prompt = f"""The user asked: "{prompt}"

Available context (limited due to extraction issues):
{context}

Please provide a helpful response but be clear about the limitations of the available content."""
        
        elif context:
            # Normal research paper with good content
            full_prompt = f"""You are an expert research paper analyzer. Please answer the user's question based on the provided research paper content.

Research Paper Content:
{context[:3500]}

User's Question: {prompt}

Please provide a comprehensive, accurate answer based specifically on the research paper content."""
        else:
            # General question without specific context
            full_prompt = f"""You are an expert AI research assistant. Please provide a comprehensive and accurate answer to the following question:

Question: {prompt}

Please provide a detailed, well-structured response that would be helpful for someone analyzing research papers."""
        
        payload = {
            "model": OLLAMA_MODEL,
            "prompt": full_prompt,
            "stream": False,
            "options": {
                "temperature": 0.3,
                "top_p": 0.8,
                "num_predict": 2000,
                "repeat_penalty": 1.1
            }
        }
        
        print(f"🤖 Calling Ollama for: {prompt[:100]}...")
        response = requests.post(f"{OLLAMA_BASE_URL}/api/generate", json=payload, timeout=120)
        
        if response.status_code == 200:
            result = response.json()
            answer = result.get("response", "").strip()
            print(f"✅ Ollama response received ({len(answer)} characters)")
            return answer
        else:
            print(f"❌ Ollama API error: {response.status_code}")
            return f"I apologize, but I encountered an error while processing your question. Please try again."
            
    except Exception as e:
        print(f"❌ Ollama API call failed: {e}")
        return f"I apologize, but I'm currently unable to process your question. Please try again later."

def _is_valid_pdf(file_path: str) -> bool:
    """Check if file is a valid PDF"""
    try:
        with open(file_path, "rb") as f:
            header = f.read(4)
            # Check for PDF header
            if header != b'%PDF':
                return False
            
            # Check file size
            f.seek(0, 2)  # Seek to end
            file_size = f.tell()
            if file_size < 100:  # PDFs should be at least 100 bytes
                return False
            
            return True
    except:
        return False

@app.get("/")
async def root():
    components_status = {
        "pdf_processor": pdf_processor is not None,
        "image_processor": image_processor is not None,
        "llm_analyzer": llm_analyzer is not None,
        "rag_system": rag_system is not None,
        "ollama_available": OLLAMA_AVAILABLE,
        "ollama_model": OLLAMA_MODEL if OLLAMA_AVAILABLE else None
    }
    
    return {
        "message": "AI Research Paper Analyzer API is running!",
        "status": "active",
        "components": components_status,
        "endpoints": {
            "health": "/health",
            "analyze_pdf": "/analyze-pdf",
            "analyze_image": "/analyze-image",
            "ask_question": "/ask-question",
            "documents": "/documents",
            "paper_overview": "/paper-overview",
            "ollama_status": "/ollama-status"
        }
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy", 
        "message": "Backend server is working correctly",
        "ollama_available": OLLAMA_AVAILABLE
    }

@app.get("/ollama-status")
async def ollama_status():
    """Check Ollama status and available models"""
    try:
        response = requests.get(f"{OLLAMA_BASE_URL}/api/tags", timeout=10)
        if response.status_code == 200:
            models_data = response.json()
            models = models_data.get("models", [])
            available_models = [model.get("name") for model in models if model.get("name")]
            
            return {
                "status": "connected",
                "message": "Ollama server is running",
                "current_model": OLLAMA_MODEL,
                "available_models": available_models
            }
        else:
            return {
                "status": "error",
                "message": f"Ollama server error: {response.status_code}"
            }
    except Exception as e:
        return {
            "status": "disconnected",
            "message": f"Cannot connect to Ollama server: {str(e)}"
        }

@app.post("/analyze-pdf")
async def analyze_pdf(file: UploadFile = File(...), question: str = Form(None)):
    if not pdf_processor:
        raise HTTPException(status_code=500, detail="PDF processor not available")
    
    try:
        print(f"📄 Processing PDF: {file.filename}")
        
        # Save uploaded file
        file_path = f"data/uploads/{file.filename}"
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Validate PDF file first
        if not _is_valid_pdf(file_path):
            # Try to read the file to get more specific error
            try:
                with open(file_path, "rb") as f:
                    header = f.read(10)
                    print(f"File header: {header}")
            except Exception as e:
                print(f"File read error: {e}")
            
            raise HTTPException(status_code=400, detail="Invalid or corrupted PDF file. Please upload a valid PDF.")
        
        # Extract text from PDF
        text_content = pdf_processor.extract_text(file_path)
        print(f"📊 Extracted {len(text_content)} characters")
        
        if not text_content.strip():
            raise HTTPException(status_code=400, detail="No text content found in PDF. This might be a scanned PDF or image-based PDF.")
        
        # Add to RAG system
        if rag_system:
            rag_system.add_document(file.filename, text_content)
        
        response_data = {
            "success": True,
            "filename": file.filename,
            "text_length": len(text_content),
            "extracted_text": text_content[:500] + "..." if len(text_content) > 500 else text_content
        }
        
        # If user asked a question, use Ollama to answer it
        if question and question.strip():
            print(f"❓ Answering question with Ollama: {question}")
            ollama_answer = call_ollama_api(question, text_content, "research_paper")
            
            response_data["answer"] = {
                "answer": ollama_answer,
                "question": question,
                "ai_model": OLLAMA_MODEL,
                "paper_specific": True
            }
        # If no specific question but user wants summary
        elif question and any(keyword in question.lower() for keyword in ['summary', 'summarize', 'simplify', 'overview']):
            print("📝 Generating summary with Ollama...")
            summary_prompt = "Please provide a comprehensive summary of this research paper:"
            summary = call_ollama_api(summary_prompt, text_content, "research_paper")
            response_data["summary"] = summary
        
        return JSONResponse(content=response_data)
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ PDF analysis error: {str(e)}")
        
        # Provide more specific error messages
        error_msg = str(e)
        if "EOF marker not found" in error_msg:
            error_msg = "The PDF file appears to be corrupted or incomplete. Please check the file and try again."
        elif "encrypted" in error_msg.lower():
            error_msg = "The PDF file is encrypted and cannot be read. Please provide an unencrypted PDF."
        elif "no text content" in error_msg.lower():
            error_msg = "The PDF file does not contain extractable text. It might be a scanned image PDF."
        
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {error_msg}")

@app.post("/analyze-image")
async def analyze_image(file: UploadFile = File(...), question: str = Form(None)):
    if not image_processor:
        raise HTTPException(status_code=500, detail="Image processor not available")
    
    try:
        print(f"🖼️ Processing image: {file.filename}")
        
        # Read the uploaded file
        content = await file.read()
        
        # Convert to base64 for the image processor
        image_data = base64.b64encode(content).decode('utf-8')
        
        # Analyze the image
        analysis = image_processor.analyze_research_image(image_data)
        
        response_data = {
            "success": True,
            "filename": file.filename,
            "analysis": analysis
        }
        
        # If OCR was successful and we have text content
        if (analysis.get("ocr_results", {}).get("success") and 
            analysis["ocr_results"].get("extracted_text")):
            
            text_content = analysis["ocr_results"]["extracted_text"]
            
            # Add to RAG system
            if rag_system:
                rag_system.add_document(file.filename, text_content)
            
            # If user asked a question, use Ollama
            if question:
                print(f"❓ Answering question from image with Ollama: {question}")
                ollama_answer = call_ollama_api(question, text_content, "research_image")
                
                response_data["answer"] = {
                    "answer": ollama_answer,
                    "question": question,
                    "ai_model": OLLAMA_MODEL,
                    "paper_specific": True
                }
            
            # If user wants summary
            elif question and any(keyword in question.lower() for keyword in ['summary', 'summarize', 'simplify', 'overview']):
                print("📝 Generating summary from image with Ollama...")
                summary_prompt = "Please summarize the content extracted from this research image:"
                summary = call_ollama_api(summary_prompt, text_content, "research_image")
                response_data["summary"] = summary
        
        return JSONResponse(content=response_data)
        
    except Exception as e:
        print(f"❌ Image analysis error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

@app.post("/ask-question")
async def ask_question(question: str = Form(...)):
    """General question answering using Ollama exclusively"""
    try:
        if not question.strip():
            raise HTTPException(status_code=400, detail="Question cannot be empty")
        
        print(f"❓ Answering general question with Ollama: {question}")
        
        # Use Ollama for all general questions
        ollama_answer = call_ollama_api(question)
        
        return JSONResponse(content={
            "success": True,
            "answer": {
                "answer": ollama_answer,
                "question": question,
                "ai_model": OLLAMA_MODEL,
                "paper_specific": False
            },
            "question": question
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error answering question: {str(e)}")

@app.get("/documents")
async def list_documents():
    if not rag_system:
        raise HTTPException(status_code=500, detail="RAG system not available")
    
    try:
        documents = rag_system.list_documents()
        return JSONResponse(content={
            "success": True,
            "documents": documents,
            "count": len(documents)
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listing documents: {str(e)}")

@app.get("/paper-overview")
async def get_paper_overview():
    if not rag_system:
        raise HTTPException(status_code=500, detail="RAG system not available")
    
    try:
        overview = rag_system.get_paper_overview()
        return JSONResponse(content={
            "success": True,
            "overview": overview
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting paper overview: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting AI Research Paper Analyzer API...")
    print("🌐 Server available at: http://localhost:8000")
    print("📚 API docs at: http://localhost:8000/docs")
    print("🔍 Check Ollama status at: http://localhost:8000/ollama-status")
    print("🤖 Primary AI: Ollama (Llama 3)")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)