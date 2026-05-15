<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=200&section=header&text=AI%20Research%20Analyzer&fontSize=50&fontColor=fff&animation=twinkling&fontAlignY=35&desc=Groq%20Llama%203%2070B%20%E2%80%A2%20LangChain%20RAG%20%E2%80%A2%20FAISS%20%E2%80%A2%20FastAPI%20%E2%80%A2%20React%2018&descAlignY=55&descSize=16" />

<br/>

[![Typing SVG](https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=600&size=22&duration=3000&pause=1000&color=00FF9D&center=true&vCenter=true&multiline=false&random=false&width=600&height=50&lines=Upload+a+paper.+Get+answers.+No+hallucinations.;Powered+by+Groq+%E2%80%94+sub-second+LLM+inference.;LangChain+RAG+%E2%80%94+grounded+every+time.;Built+by+Sanjeevni+Dhir+%F0%9F%9A%80)](https://git.io/typing-svg)

<br/>

[![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![LangChain](https://img.shields.io/badge/LangChain-0.2%2B-1C3C3C?style=for-the-badge&logo=chainlink&logoColor=white)](https://langchain.com)
[![Groq](https://img.shields.io/badge/Groq-Llama_3_70B-F55036?style=for-the-badge&logo=meta&logoColor=white)](https://console.groq.com)

[![License: MIT](https://img.shields.io/badge/License-MIT-00FF9D?style=for-the-badge)](LICENSE)
[![Last Commit](https://img.shields.io/github/last-commit/sanju234-san/ai-research-analyzer?style=for-the-badge&color=7b5ea7)](https://github.com/sanju234-san/ai-research-analyzer/commits)
[![Repo Size](https://img.shields.io/github/repo-size/sanju234-san/ai-research-analyzer?style=for-the-badge&color=f5a623)](https://github.com/sanju234-san/ai-research-analyzer)
[![Stars](https://img.shields.io/github/stars/sanju234-san/ai-research-analyzer?style=for-the-badge&color=00FF9D)](https://github.com/sanju234-san/ai-research-analyzer/stargazers)

</div>

---

<div align="center">

## 🔬 What Is This?

</div>

Most research tools just **extract text**. This one **understands** it.

Upload any research paper — PDF or scanned image — and the system builds a semantic index over the document, then answers your questions with context pulled **directly** from the paper. Every answer cites its source chunks. Zero hallucinations. Zero external data leaks.

```
┌─ You upload a PDF ──────────────────────────────────────────────┐
│                                                                  │
│  Chunk (800 tok) → Embed (MiniLM-L6-v2) → FAISS Index           │
│                                                                  │
│  Your question → Retrieve top-5 chunks → Groq Llama 3 70B       │
│                                           └─ Grounded answer ─┘ │
└──────────────────────────────────────────────────────────────────┘
```

> **Built by [Sanjeevni Dhir](https://linkedin.com/in/sanjeevnidhir)** — GenAI Engineer · SRM University Delhi-NCR · SIH 2025 National Finalist

---

## 📑 Table of Contents

<details>
<summary>Click to expand</summary>

- [Demo](#-demo)
- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [RAG Pipeline Deep Dive](#-rag-pipeline-deep-dive)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the App](#-running-the-app)
- [API Reference](#-api-reference)
- [Project Structure](#-project-structure)
- [Performance](#-performance)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [Contact](#-contact)

</details>

---

## 🎬 Demo

<div align="center">

| Upload & Analyze | Ask the Paper | Dashboard |
|:---:|:---:|:---:|
| ![Upload flow](https://via.placeholder.com/280x180/0a0a0a/00ff9d?text=Upload+PDF) | ![QA flow](https://via.placeholder.com/280x180/0a0a0a/f5a623?text=Ask+Questions) | ![Dashboard](https://via.placeholder.com/280x180/0a0a0a/7b5ea7?text=Dashboard) |
| Drag & drop your paper | Grounded answers with source chunks | Track all analyzed papers |

> 💡 **[Live Demo →](https://your-demo-url.vercel.app)** &nbsp;|&nbsp; **[Watch 2-min walkthrough →](https://youtube.com)**

</div>

---

## ✨ Features

<div align="center">

| | Feature | Description |
|---|---|---|
| 📄 | **Multi-format Ingestion** | PDF, PNG, JPG, JPEG, BMP, TIFF |
| 🔍 | **OCR Support** | Scanned papers handled via Tesseract |
| 🧠 | **LangChain RAG** | Recursive chunking → dense embeddings → FAISS retrieval |
| ⚡ | **Groq Inference** | Sub-second answers via Llama 3 70B on LPU hardware |
| 📝 | **AI Summaries** | Structured markdown: abstract, findings, methodology, significance |
| 🏷️ | **LLM Keywords** | Domain-aware extraction — not keyword frequency |
| 🎯 | **Grounded Q&A** | Every answer cites the exact retrieved chunks |
| 🔎 | **Source Transparency** | See which FAISS chunks powered each answer |
| 📊 | **Plagiarism Gauge** | Visual similarity scoring with SVG pie chart |
| 🌑 | **Dark Luxury UI** | Glassmorphism, Framer Motion, Playfair Display |

</div>

---

## 🏗️ Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                    React 18 Frontend                           │
│   HomePage · UploadPage · AnalysisPage · DashboardPage         │
│        Tailwind CSS · Framer Motion · Stitch Design            │
└─────────────────────────┬──────────────────────────────────────┘
                          │  REST  (multipart/form-data + JSON)
                          ▼
┌────────────────────────────────────────────────────────────────┐
│                    FastAPI Backend                             │
│                                                                │
│   /analyze-pdf  ──► PDFProcessor (pdfplumber + PyPDF2)        │
│   /analyze-image ─► ImageProcessor (Tesseract OCR)            │
│   /ask-question ──► LangChain RAG System                      │
│                          │                                     │
│           ┌──────────────▼───────────────────┐                │
│           │      LangChain RAG Pipeline       │                │
│           │                                   │                │
│           │  RecursiveCharacterSplitter        │                │
│           │  chunk_size=800, overlap=150       │                │
│           │              ↓                    │                │
│           │  HuggingFaceEmbeddings             │                │
│           │  (all-MiniLM-L6-v2, L2-norm)      │                │
│           │              ↓                    │                │
│           │  FAISS Index (cosine, k=5)         │                │
│           │  ← persisted to disk →            │                │
│           │              ↓                    │                │
│           │  RetrievalQA Chain                │                │
│           │  (stuff | custom RAG prompt)      │                │
│           │              ↓                    │                │
│           │  Groq: llama3-70b-8192            │                │
│           └───────────────────────────────────┘                │
└────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

<div align="center">

### Backend

![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![LangChain](https://img.shields.io/badge/LangChain-1C3C3C?style=for-the-badge&logo=chainlink&logoColor=white)
![Groq](https://img.shields.io/badge/Groq_Llama_3-F55036?style=for-the-badge&logo=meta&logoColor=white)
![FAISS](https://img.shields.io/badge/FAISS-0467DF?style=for-the-badge&logo=meta&logoColor=white)
![HuggingFace](https://img.shields.io/badge/HuggingFace-FFD21E?style=for-the-badge&logo=huggingface&logoColor=black)
![Tesseract](https://img.shields.io/badge/Tesseract_OCR-4285F4?style=for-the-badge&logo=google&logoColor=white)

### Frontend

![React](https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)

</div>

---

## 🔬 RAG Pipeline Deep Dive

<details>
<summary><b>📦 Chunking Strategy</b></summary>

<br/>

Uses `RecursiveCharacterTextSplitter` with an academic-text-aware separator hierarchy:

```python
separators = ["\n\n", "\n", ". ", "! ", "? ", " ", ""]
chunk_size  = 800    # tokens
overlap     = 150    # tokens — preserves cross-chunk context
```

This prioritizes paragraph boundaries first, then sentence boundaries, before falling back to word splits — keeping semantic units intact.

</details>

<details>
<summary><b>🧮 Embedding Model</b></summary>

<br/>

`sentence-transformers/all-MiniLM-L6-v2` — chosen for:

- **Speed**: ~14,000 sentences/sec on CPU
- **Quality**: Strong performance on technical and scientific text
- **Size**: 80MB — fast to load, no GPU needed
- **Normalization**: L2-normalized embeddings enable cosine similarity via FAISS inner product search

</details>

<details>
<summary><b>🎯 Retrieval & Hallucination Prevention</b></summary>

<br/>

The custom RAG prompt is the key to zero hallucination:

```
You are an expert research paper analyst. Answer the question using ONLY
the provided context from the paper. If the answer is not in the context,
say "This information is not available in the provided paper."
```

The model **cannot** fall back to training knowledge — every answer is mechanically grounded in retrieved chunks.

</details>

<details>
<summary><b>💾 Index Persistence</b></summary>

<br/>

The FAISS index is saved to `server/data/vector_store/` after every ingestion. On server restart, it reloads automatically — document history persists across sessions without re-ingesting.

</details>

---

## ✅ Prerequisites

Before you start, verify these are installed:

```bash
python --version    # 3.10 or higher
node --version      # 18 or higher
tesseract --version # 4.x or 5.x
```

You'll also need:

- 🔑 **Groq API Key** — free at [console.groq.com](https://console.groq.com)
- 📖 **Tesseract OCR** — [install guide](https://github.com/tesseract-ocr/tesseract#installing-tesseract)

---

## 🚀 Installation

### 1. Clone

```bash
git clone https://github.com/sanju234-san/ai-research-analyzer.git
cd ai-research-analyzer
```

### 2. Backend

```bash
cd server

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate        # macOS / Linux
# venv\Scripts\activate         # Windows

# Install dependencies
pip install -r requirements.txt

# Create data directories
mkdir -p data/uploads data/vector_store
```

### 3. Frontend

```bash
cd ../client
npm install
```

---

## ⚙️ Configuration

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:

```env
GROQ_API_KEY=your_groq_api_key_here
```

<details>
<summary><b>All configurable parameters (server/app/config.py)</b></summary>

<br/>

| Parameter | Default | Description |
|---|---|---|
| `GROQ_MODEL` | `llama3-70b-8192` | Primary generation model |
| `GROQ_FAST_MODEL` | `llama3-8b-8192` | Lightweight model for classification |
| `EMBEDDING_MODEL` | `all-MiniLM-L6-v2` | HuggingFace embedding model |
| `CHUNK_SIZE` | `800` | Tokens per document chunk |
| `CHUNK_OVERLAP` | `150` | Overlap between adjacent chunks |
| `RETRIEVAL_K` | `5` | Chunks retrieved per query |
| `MAX_FILE_SIZE_MB` | `20` | Maximum upload size |

</details>

---

## ▶️ Running the App

Open **two terminals** from the project root:

**Terminal 1 — API Server**

```bash
cd server
source venv/bin/activate
python run.py
```

```
INFO:     Uvicorn running on http://localhost:8000
INFO:     LLM: groq/llama3-70b-8192
INFO:     Vector store: FAISS (langchain+faiss)
```

**Terminal 2 — Frontend Dev Server**

```bash
cd client
npm run dev
```

```
  VITE v5.x  ready in 300ms
  ➜  Local:   http://localhost:5173/
```

📖 Swagger UI → [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 📡 API Reference

<details>
<summary><b>GET /health</b></summary>

<br/>

```http
GET /health
```

```json
{
  "status": "healthy",
  "llm": "groq/llama3-70b-8192",
  "rag": "langchain+faiss",
  "version": "2.0.0"
}
```

</details>

<details>
<summary><b>POST /analyze-pdf</b></summary>

<br/>

```http
POST /analyze-pdf
Content-Type: multipart/form-data
```

| Field | Type | Required | Description |
|---|---|---|---|
| `file` | File | ✅ | PDF document |
| `question` | string | ❌ | Optional — answer this at ingestion time |

```json
{
  "success": true,
  "doc_id": "uuid-v4",
  "filename": "attention_is_all_you_need.pdf",
  "text_length": 52400,
  "summary": "## Abstract Summary\nThis paper proposes...",
  "keywords": ["transformer", "attention mechanism", "self-attention"],
  "rag_stats": { "chunks_created": 65, "avg_chunk_size": 806 },
  "answer": null
}
```

</details>

<details>
<summary><b>POST /analyze-image</b></summary>

<br/>

```http
POST /analyze-image
Content-Type: multipart/form-data
```

| Field | Type | Required | Description |
|---|---|---|---|
| `file` | File | ✅ | PNG, JPG, JPEG, BMP, TIFF |
| `question` | string | ❌ | Optional question |

Response schema identical to `/analyze-pdf`.

</details>

<details>
<summary><b>POST /ask-question</b></summary>

<br/>

```http
POST /ask-question
Content-Type: multipart/form-data
```

| Field | Type | Required |
|---|---|---|
| `question` | string | ✅ |

```json
{
  "success": true,
  "answer": "The paper proposes scaled dot-product attention...",
  "question": "What attention mechanism is used?",
  "source_chunks": ["...Multi-head attention allows...", "...The dot products..."],
  "chunks_used": 5
}
```

</details>

<details>
<summary><b>GET /documents &nbsp;|&nbsp; DELETE /reset</b></summary>

<br/>

```http
GET /documents   → list all ingested documents
DELETE /reset    → clear the FAISS vector store
```

</details>

---

## 📁 Project Structure

```
ai-research-analyzer/
│
├── 📂 server/
│   ├── 📂 app/
│   │   ├── config.py           ← env vars, model names, chunk params
│   │   ├── main.py             ← FastAPI routes + CORS
│   │   ├── rag_system.py       ← LangChain RAG (the core)
│   │   ├── pdf_processor.py    ← pdfplumber + PyPDF2
│   │   └── image_processor.py  ← Tesseract OCR pipeline
│   ├── 📂 data/
│   │   ├── uploads/            ← uploaded documents
│   │   └── vector_store/       ← persisted FAISS index
│   ├── .env.example
│   ├── requirements.txt
│   └── run.py
│
└── 📂 client/
    ├── 📂 src/
    │   ├── 📂 pages/
    │   │   ├── HomePage.jsx
    │   │   ├── UploadPage.jsx
    │   │   ├── AnalysisPage.jsx
    │   │   └── DashboardPage.jsx
    │   ├── 📂 components/
    │   │   ├── NavBar.jsx
    │   │   ├── LoadingOverlay.jsx
    │   │   ├── KeywordCloud.jsx
    │   │   ├── RAGStats.jsx
    │   │   ├── MarkdownRenderer.jsx
    │   │   └── TechBadge.jsx
    │   ├── 📂 services/
    │   │   └── api.js
    │   └── App.jsx
    ├── index.html
    ├── tailwind.config.js
    └── vite.config.js
```

---

## 📈 Performance

<div align="center">

| Metric | Value |
|---|---|
| ⚡ Average LLM response | ~800ms (Groq LPU) |
| 📄 PDF ingestion (10 pages) | ~3–5 seconds |
| 🔍 Vector retrieval (k=5) | <50ms (FAISS CPU) |
| 🧮 Embedding throughput | ~14,000 sentences/sec |
| 💾 Index size (100-page paper) | ~2MB on disk |

</div>

---

## 🗺️ Roadmap

- [ ] **Streaming responses** — token-by-token via Server-Sent Events
- [ ] **Multi-document RAG** — query across multiple ingested papers simultaneously
- [ ] **Citation graph** — D3.js visualization of paper references
- [ ] **Real plagiarism API** — Copyleaks / Turnitin integration
- [ ] **Export reports** — full analysis as PDF/DOCX download
- [ ] **Re-ranking** — cross-encoder reranker for higher retrieval precision
- [ ] **Hybrid search** — BM25 + dense retrieval ensemble
- [ ] **User auth** — JWT-based auth + cloud document storage

---

## 🤝 Contributing

Contributions are welcome!

```bash
# Fork the repo, then:
git checkout -b feature/your-feature-name
git commit -m "feat: describe your change"
git push origin feature/your-feature-name
# Open a Pull Request
```

Please run linting before submitting:

```bash
# Backend
ruff check server/

# Frontend
cd client && npm run lint
```

---

## 📬 Contact

<div align="center">

**Sanjeevni Dhir** — GenAI Engineer

[![LinkedIn](https://img.shields.io/badge/LinkedIn-sanjeevnidhir-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/sanjeevnidhir)
[![GitHub](https://img.shields.io/badge/GitHub-sanju234--san-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/sanju234-san)
[![Email](https://img.shields.io/badge/Email-sanjeevnidhir05%40gmail.com-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:sanjeevnidhir05@gmail.com)

</div>

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=100&section=footer" />

<sub>Built with Groq · LangChain · FAISS · React 18 · FastAPI · ☕</sub>

</div>
