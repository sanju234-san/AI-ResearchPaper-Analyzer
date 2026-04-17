# AI Research Paper Analyzer

A full-stack AI application that extracts, analyzes, and answers questions about research papers using a custom RAG pipeline powered by Llama 3.

**Built by [Sanjeevni Dhir](https://linkedin.com/in/sanjeevnidhir) · [GitHub](https://github.com/sanju234-san)**

---

## What It Does

Upload a research paper (PDF or image) and the system will:
- Extract text via PDF parsing or Tesseract OCR
- Identify keywords and key concepts automatically
- Answer natural language questions about the paper using a local RAG pipeline
- Generate a plagiarism similarity report with visual breakdown
- Store and manage all analyzed documents in a dashboard

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide React |
| **Backend** | FastAPI, Python 3.8+ |
| **AI / LLM** | Ollama (Llama 3), Custom RAG System, Vector Store |
| **Document Processing** | PyPDF2, pdfplumber, Tesseract OCR, Pillow |

---

## Architecture

```
React Frontend
     │
     ▼  REST API
FastAPI Backend
     ├── PDF Processor     (pdfplumber / PyPDF2)
     ├── Image Processor   (Tesseract OCR)
     ├── LLM Analyzer      (Ollama → Llama 3)
     └── RAG System        (Vector Store + Retrieval)
          │
          ▼
     Local Storage + Ollama Runtime
```

The RAG pipeline chunks extracted text into embeddings, stores them in a local vector store, and retrieves relevant context at query time before passing it to Llama 3 — enabling grounded, accurate answers scoped to the uploaded paper.

---

## Key Features

- **Multi-format ingestion** — PDF, PNG, JPG, JPEG, BMP, TIFF
- **OCR fallback** — scanned/image-based papers handled via Tesseract
- **Context-aware Q&A** — answers are grounded in the paper, not hallucinated
- **Plagiarism report** — similarity scoring with pie chart visualization
- **Document dashboard** — track all uploaded papers with metadata and word counts
- **Fully local** — no external API calls; LLM runs on-device via Ollama

---

## Local Setup

**Prerequisites:** Python 3.8+, Node.js 16+, [Ollama](https://ollama.ai/), Tesseract OCR

```bash
# 1. Clone
git clone https://github.com/sanju234-san/ai-research-analyzer.git
cd ai-research-analyzer

# 2. Backend
cd server
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
mkdir -p data/uploads data/vector_store

# 3. Frontend
cd ../client && npm install

# 4. Pull the model
ollama pull llama3
```

**Run:**
```bash
# Terminal 1
ollama serve

# Terminal 2
cd server && python run.py       # → http://localhost:8000

# Terminal 3
cd client && npm run dev         # → http://localhost:5173
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Health check + Ollama status |
| `POST` | `/analyze-pdf` | Upload and analyze a PDF |
| `POST` | `/analyze-image` | Upload and OCR an image |
| `POST` | `/ask-question` | Ask a question against stored context |
| `GET` | `/documents` | List all analyzed documents |
| `GET` | `/ollama-status` | Check LLM connectivity and available models |

Full interactive docs at `http://localhost:8000/docs` (Swagger UI).

---

## Project Structure

```
ai-research-analyzer/
├── server/
│   ├── app/
│   │   ├── main.py             # FastAPI app + CORS + routing
│   │   ├── pdf_processor.py    # PDF text extraction
│   │   ├── image_processor.py  # OCR pipeline
│   │   ├── llm_analyzer.py     # Ollama integration
│   │   ├── rag_system.py       # Retrieval-Augmented Generation
│   │   └── vector_store.py     # Document embedding + retrieval
│   ├── requirements.txt
│   └── run.py
│
└── client/
    ├── src/
    │   ├── pages/              # HomePage, UploadPage, AnalysisPage, DashboardPage
    │   ├── services/api.js     # Axios API layer
    │   └── App.jsx
    └── package.json
```

---

## Roadmap

- [ ] Real plagiarism API integration (Turnitin / Copyleaks)
- [ ] Multi-paper comparison and citation graph
- [ ] User auth + cloud storage
- [ ] Export analysis as PDF/DOCX report
- [ ] Mobile app (React Native)

---

## Contact

**Sanjeevni Dhir**
[sanjeevnidhir05@gmail.com](mailto:sanjeevnidhir05@gmail.com) · [LinkedIn](https://linkedin.com/in/sanjeevnidhir) · [GitHub](https://github.com/sanju234-san)
