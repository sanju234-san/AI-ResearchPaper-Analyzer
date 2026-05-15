import sys
sys.stdout.reconfigure(encoding='utf-8')
import uvicorn
from app.main import app

if __name__ == "__main__":
    print("🚀 Starting AI Research Paper Analyzer v2.0.0")
    print("📍 Local: http://localhost:8000")
    print("📚 API Docs: http://localhost:8000/docs")
    print("🔍 Health Check: http://localhost:8000/health")
    print("🤖 AI Provider: Groq (Llama 3 70B)")
    print("🔗 RAG Engine: LangChain + FAISS")
    print("\nPress CTRL+C to stop the server\n")

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        access_log=True
    )