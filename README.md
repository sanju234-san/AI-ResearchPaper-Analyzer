# 🔬 AI Research Paper Analyzer

> **Full-stack RAG application** that extracts, understands, and answers questions about research papers — powered by Llama 3 running entirely on-device.

**Built by [Sanjeevni Dhir](https://linkedin.com/in/sanjeevnidhir)** · B.Tech CSE (Data Science & AI), SRM University Delhi-NCR  
[![LinkedIn](https://img.shields.io/badge/LinkedIn-sanjeevnidhir-0A66C2?style=flat&logo=linkedin)](https://linkedin.com/in/sanjeevnidhir)
[![GitHub](https://img.shields.io/badge/GitHub-sanju234--san-181717?style=flat&logo=github)](https://github.com/sanju234-san)

---

## Overview

Most research tools just extract text. This one **understands** it.

Upload a PDF or scanned image of any research paper, and the system builds a local vector store from the document, then answers your questions with context pulled directly from the paper — no hallucinations, no external API calls, no data leaving your machine.

Built as a showcase of end-to-end RAG architecture: from raw document ingestion → chunking → embedding → retrieval → grounded LLM response.

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide React |
| **Backend** | FastAPI, Python 3.8+ |
| **LLM / AI** | Ollama (Llama 3), Custom RAG Pipeline, Vector Store |
| **Document Processing** | PyPDF2, pdfplumber, Tesseract OCR, Pillow |

---

## Features

- **PDF & Image ingestion** — supports PDF, PNG, JPG, JPEG, BMP, TIFF
- **OCR fallback** — scanned or image-based papers handled via Tesseract
- **Grounded Q&A** — answers sourced from the paper via retrieval, not generation alone
- **Keyword extraction** — auto-identifies key concepts and terminology
- **Plagiarism report** — similarity scoring with pie chart visualization
- **Document dashboard** — track all uploaded papers with metadata and word counts
- **Fully local** — LLM inference runs on-device via Ollama; zero external API dependencies

---

## System Architecture

```
┌──────────────────────────────────────────┐
│           React 18 Frontend              │
│  Home · Upload · Analysis · Dashboard   │
└────────────────┬─────────────────────────┘
                 │  REST API
                 ▼
┌──────────────────────────────────────────┐
│           FastAPI Backend                │
│                                          │
│  ┌─────────────┐   ┌──────────────────┐  │
│  │PDF Processor│   │ Image Processor  │  │
│  │(pdfplumber) │   │ (Tesseract OCR)  │  │
│  └──────┬──────┘   └────────┬─────────┘  │
│         └────────┬──────────┘            │
│                  ▼                       │
│        ┌──────────────────┐              │
│        │    RAG System    │              │
│        │  Chunk → Embed   │              │
│        │  Retrieve → LLM  │              │
│        └────────┬─────────┘              │
└─────────────────┼────────────────────────┘
                  ▼
┌──────────────────────────────────────────┐
│      Ollama Runtime (Llama 3)            │
│      Local Vector Store (JSON)           │
└──────────────────────────────────────────┘
```

**How the RAG pipeline works:**
1. Uploaded document is parsed and split into overlapping text chunks
2. Chunks are embedded and stored in a local vector store
3. On query, relevant chunks are retrieved by semantic similarity
4. Retrieved context + question are passed to Llama 3 for a grounded answer

---

## Local Setup

**Prerequisites:** Python 3.8+, Node.js 16+, [Ollama](https://ollama.ai/), Tesseract OCR

```bash
# 1. Clone the repo
git clone https://github.com/sanju234-san/ai-research-analyzer.git
cd ai-research-analyzer

# 2. Backend
cd server
python -m venv venv && source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
mkdir -p data/uploads data/vector_store

# 3. Frontend
cd ../client && npm install

# 4. Pull the model
ollama pull llama3
```

**Start all three services:**

```bash
# Terminal 1 — LLM runtime
ollama serve

# Terminal 2 — API server → http://localhost:8000
cd server && python run.py

# Terminal 3 — React dev server → http://localhost:5173
cd client && npm run dev
```

Swagger UI available at `http://localhost:8000/docs`.

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Health check + Ollama connectivity |
| `POST` | `/analyze-pdf` | Upload PDF → extract text, keywords, plagiarism score |
| `POST` | `/analyze-image` | Upload image → OCR + classification |
| `POST` | `/ask-question` | Query the RAG system |
| `GET` | `/documents` | List all stored documents |
| `GET` | `/ollama-status` | LLM status + available models |

---

## Project Structure

```
ai-research-analyzer/
├── server/
│   ├── app/
│   │   ├── main.py              # FastAPI app, routing, CORS
│   │   ├── pdf_processor.py     # PDF extraction (pdfplumber + PyPDF2)
│   │   ├── image_processor.py   # Tesseract OCR pipeline
│   │   ├── llm_analyzer.py      # Ollama API integration
│   │   ├── rag_system.py        # Chunking, retrieval, prompt construction
│   │   └── vector_store.py      # Embedding storage and similarity search
│   ├── requirements.txt
│   └── run.py
│
└── client/
    └── src/
        ├── pages/               # HomePage, UploadPage, AnalysisPage, DashboardPage
        ├── services/api.js      # Centralized Axios API layer
        └── App.jsx
```

---

## What I Learned / Why I Built This

This project was about going beyond "call an LLM API and display the response." The interesting engineering problems were:

- **Chunking strategy** — overlapping windows vs. sentence boundaries and how chunk size affects retrieval quality
- **Retrieval precision** — cosine similarity thresholds and graceful fallback when no strong match exists
- **Prompt design for RAG** — constraining the model to only use retrieved context, not its training knowledge
- **OCR noise handling** — Tesseract output on low-quality scans needed preprocessing before chunking was viable

---

## Roadmap

- [ ] Real plagiarism API (Copyleaks / Turnitin integration)
- [ ] Multi-paper comparison and citation graph visualization
- [ ] Export full analysis as PDF/DOCX report
- [ ] User auth + cloud document storage
- [ ] Streaming LLM responses

---

## Contact

**Sanjeevni Dhir** — GenAI Engineer  
[sanjeevnidhir05@gmail.com](mailto:sanjeevnidhir05@gmail.com) · [LinkedIn](https://linkedin.com/in/sanjeevnidhir) · [GitHub](https://github.com/sanju234-san)
