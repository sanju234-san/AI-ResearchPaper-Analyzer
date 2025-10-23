import uvicorn
from app.main import app

if __name__ == "__main__":
    print("🚀 Starting AI Research Paper Analyzer with IBM Watsonx...")
    print("📍 Local: http://localhost:8000")
    print("📚 API Docs: http://localhost:8000/docs")
    print("🔍 Health Check: http://localhost:8000/health")
    print("🤖 AI Provider: IBM Watsonx.ai")
    print("📝 No Project ID Required")
    print("\nPress CTRL+C to stop the server\n")
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        access_log=True
    )