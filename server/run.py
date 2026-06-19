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

    import os
    host = os.getenv('HOST', 'localhost')
    port = int(os.getenv('PORT', '8000'))
    uvicorn.run(
        "app.main:app",
        host=host,
        port=port,
        reload=os.getenv('ENVIRONMENT', 'development') != 'production',
        access_log=True
    )