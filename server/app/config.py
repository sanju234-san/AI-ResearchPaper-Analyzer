"""
Centralized configuration for AI Research Paper Analyzer.
Loads environment variables and defines constants for Groq, LangChain, and FAISS.
"""

import os
from dotenv import load_dotenv

try:
    load_dotenv()
except Exception as e:
    print(f"Error loading .env file: {e}")

# --- Groq API ---
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "").strip()
GROQ_MODEL = "llama-3.3-70b-versatile"          # primary model
GROQ_FAST_MODEL = "llama-3.1-8b-instant"      # for quick classification tasks

# --- Embeddings ---
EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
HF_TOKEN = os.getenv("HF_TOKEN", "your_secure_default_token_here")  # HuggingFace Inference API token

# --- Chunking ---
CHUNK_SIZE = 800
CHUNK_OVERLAP = 150

# --- Retrieval ---
RETRIEVAL_K = 5

# --- Paths ---
import os

# Ensure paths are absolute and prevent path traversal
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
import os

# Ensure paths are absolute and prevent path traversal
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
VECTOR_STORE_PATH = os.path.abspath(os.path.join(BASE_DIR, "data", "vector_store"))
UPLOAD_PATH = os.path.abspath(os.path.join(BASE_DIR, "data", "uploads"))
if not os.path.commonpath([UPLOAD_PATH, BASE_DIR]) == BASE_DIR:
    raise ValueError("UPLOAD_PATH is not within BASE_DIR")

# --- Limits ---
MAX_FILE_SIZE_MB = 20

# --- Cloudinary ---
CLOUDINARY_CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME")
CLOUDINARY_API_KEY = os.getenv("CLOUDINARY_API_KEY")
CLOUDINARY_API_SECRET = os.getenv("CLOUDINARY_API_SECRET", "").strip()
CLOUDINARY_FOLDER = "paperlytics"
