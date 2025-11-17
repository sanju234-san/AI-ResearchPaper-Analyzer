# 🎓 AI Research Paper Analyzer

<div align="center">

![AI Research Paper Analyzer](https://img.shields.io/badge/AI-Research%20Analyzer-blue?style=for-the-badge&logo=react)
![Python](https://img.shields.io/badge/Python-3.8+-green?style=for-the-badge&logo=python)
![React](https://img.shields.io/badge/React-18.2+-61DAFB?style=for-the-badge&logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?style=for-the-badge&logo=fastapi)
![Ollama](https://img.shields.io/badge/Ollama-Llama%203-FF6B6B?style=for-the-badge)

**A powerful full-stack application for analyzing research papers using AI-powered OCR, text extraction, and intelligent Q&A with Llama 3**

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Usage](#-usage) • [API Documentation](#-api-documentation) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Screenshots](#-screenshots)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)
- [Acknowledgments](#-acknowledgments)

---

## 🌟 Overview

The **AI Research Paper Analyzer** is a comprehensive tool designed to help researchers, students, and academics analyze research papers efficiently. It combines cutting-edge AI technology with intuitive user experience to provide:

- **PDF Text Extraction**: Automatically extract text from research papers
- **OCR for Images**: Extract text from scanned papers or images using Tesseract
- **AI-Powered Analysis**: Get intelligent answers to questions about papers using Llama 3
- **Plagiarism Detection**: Visual plagiarism percentage with pie charts
- **Keyword Extraction**: Automatically identify key concepts and terms
- **Document Management**: Track and manage multiple analyzed papers

---

## ✨ Features

### 🔍 Core Features

| Feature | Description |
|---------|-------------|
| **📄 PDF Analysis** | Extract and analyze text from PDF research papers |
| **🖼️ Image OCR** | Extract text from images using Tesseract OCR |
| **🤖 AI Q&A** | Ask questions about papers using Ollama (Llama 3) |
| **📊 Plagiarism Detection** | Visual plagiarism percentage with interactive pie charts |
| **🔑 Keyword Extraction** | Automatic identification of important keywords |
| **💾 Document Storage** | Save and manage analyzed papers locally |
| **📈 Statistics Dashboard** | View analytics on uploaded papers |
| **🎨 Modern UI** | Beautiful, responsive React interface |

### 🎯 Advanced Features

- **RAG System**: Retrieval-Augmented Generation for context-aware answers
- **Vector Store**: Efficient document embedding and retrieval
- **Multi-format Support**: PDF, PNG, JPG, JPEG, BMP, TIFF
- **Real-time Analysis**: Fast processing with progress indicators
- **Interactive Visualizations**: Animated charts and statistics
- **Export Reports**: Download analysis results as PDF

---

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern, fast web framework for building APIs
- **Python 3.8+** - Core programming language
- **Ollama** - Local LLM inference (Llama 3)
- **PyPDF2 & pdfplumber** - PDF text extraction
- **Tesseract OCR** - Image text extraction
- **Pillow** - Image processing
- **NumPy** - Numerical computations

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons
- **React Router** - Client-side routing

### AI & ML
- **Ollama** - Local LLM runtime
- **Llama 3** - Large language model
- **Custom RAG System** - Retrieval-Augmented Generation
- **Vector Store** - Document embeddings

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Frontend (React)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │   Home   │  │  Upload  │  │ Analysis │  │Dashboard│ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTP/REST API
                      ↓
┌─────────────────────────────────────────────────────────┐
│                  Backend (FastAPI)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ PDF Processor│  │Image Processor│  │ LLM Analyzer │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│  ┌──────────────┐  ┌──────────────┐                     │
│  │  RAG System  │  │ Vector Store │                     │
│  └──────────────┘  └──────────────┘                     │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────────────┐
│              External Services & Storage                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │    Ollama    │  │  Tesseract   │  │ Local Storage│  │
│  │  (Llama 3)   │  │     OCR      │  │   (JSON)     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 📦 Installation

### Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.8+** - [Download](https://www.python.org/downloads/)
- **Node.js 16+** - [Download](https://nodejs.org/)
- **npm or yarn** - Comes with Node.js
- **Ollama** - [Download](https://ollama.ai/)
- **Tesseract OCR** - [Download](https://github.com/tesseract-ocr/tesseract)

### Quick Start

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/ai-research-analyzer.git
cd ai-research-analyzer
```

#### 2️⃣ Automated Setup (Recommended)

**For Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

**For Windows:**
```cmd
setup.bat
```

#### 3️⃣ Manual Setup

**Backend Setup:**

```bash
# Navigate to server directory
cd server

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create data directories
mkdir -p data/uploads data/vector_store
```

**Frontend Setup:**

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install
```

#### 4️⃣ Install & Setup Ollama

```bash
# Install Ollama (if not already installed)
# Visit: https://ollama.ai/

# Pull Llama 3 model
ollama pull llama3

# Start Ollama server
ollama serve
```

#### 5️⃣ Install Tesseract OCR

**Windows:**
- Download installer from: https://github.com/UB-Mannheim/tesseract/wiki
- Install to: `C:\Program Files\Tesseract-OCR\`

**Mac:**
```bash
brew install tesseract
```

**Linux:**
```bash
sudo apt-get install tesseract-ocr
```

---

## ⚙️ Configuration

### Backend Configuration (.env)

Create a `.env` file in the `server` directory:

```env
# Ollama Configuration
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3
OLLAMA_ENABLED=true

# Optional: Other models you can use
# OLLAMA_MODEL=llama2:7b
# OLLAMA_MODEL=mistral
# OLLAMA_MODEL=codellama
```

### Frontend Configuration (Optional)

Create a `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:8000
```

---

## 🚀 Usage

### Starting the Application

You need to run three services:

#### 1️⃣ Start Ollama (Terminal 1)

```bash
ollama serve
```

Keep this running in the background.

#### 2️⃣ Start Backend (Terminal 2)

```bash
cd server
source venv/bin/activate  # On Windows: venv\Scripts\activate
python run.py
```

Backend will be available at: **http://localhost:8000**

API Documentation: **http://localhost:8000/docs**

#### 3️⃣ Start Frontend (Terminal 3)

```bash
cd client
npm run dev
```

Frontend will be available at: **http://localhost:5173**

### Using the Application

1. **Open your browser** to `http://localhost:5173`
2. **Upload a paper** - Click "Analyze My Paper" or "Upload New Paper"
3. **Select file** - Choose a PDF or image file
4. **Optional: Ask a question** - Enter a question about the paper
5. **Analyze** - Click "Start Analysis"
6. **View results** - See extracted text, keywords, statistics, and plagiarism report

---

## 📚 API Documentation

### Base URL
```
http://localhost:8000
```

### Endpoints

#### Health Check
```http
GET /health
```
Check if the API is running.

**Response:**
```json
{
  "status": "healthy",
  "message": "Backend server is working correctly",
  "ollama_available": true
}
```

#### Analyze PDF
```http
POST /analyze-pdf
Content-Type: multipart/form-data
```

**Parameters:**
- `file` (required): PDF file
- `question` (optional): Question about the paper

**Response:**
```json
{
  "success": true,
  "filename": "paper.pdf",
  "text_length": 15420,
  "extracted_text": "...",
  "answer": {
    "answer": "The paper discusses...",
    "question": "What is the main contribution?",
    "ai_model": "llama3"
  }
}
```

#### Analyze Image
```http
POST /analyze-image
Content-Type: multipart/form-data
```

**Parameters:**
- `file` (required): Image file (PNG, JPG, JPEG)
- `question` (optional): Question about the image

**Response:**
```json
{
  "success": true,
  "filename": "image.png",
  "analysis": {
    "content_classification": "algorithm",
    "ocr_results": {
      "success": true,
      "extracted_text": "...",
      "word_count": 150
    }
  }
}
```

#### Ask Question
```http
POST /ask-question
Content-Type: multipart/form-data
```

**Parameters:**
- `question` (required): Your question

**Response:**
```json
{
  "success": true,
  "answer": {
    "answer": "Based on the available information...",
    "question": "What is machine learning?",
    "ai_model": "llama3"
  }
}
```

#### List Documents
```http
GET /documents
```

**Response:**
```json
{
  "success": true,
  "documents": [
    {
      "id": "paper.pdf",
      "added_date": "2023-10-27T10:30:00",
      "content_length": 15420,
      "word_count": 2850
    }
  ],
  "count": 1
}
```

#### Check Ollama Status
```http
GET /ollama-status
```

**Response:**
```json
{
  "status": "connected",
  "message": "Ollama server is running",
  "current_model": "llama3",
  "available_models": ["llama3", "llama2", "mistral"]
}
```

---

## 📁 Project Structure

```
ai-research-analyzer/
├── server/                      # Backend (Python/FastAPI)
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py             # FastAPI application
│   │   ├── pdf_processor.py    # PDF text extraction
│   │   ├── image_processor.py  # OCR and image processing
│   │   ├── llm_analyzer.py     # Ollama integration
│   │   ├── rag_system.py       # RAG implementation
│   │   └── vector_store.py     # Vector embeddings
│   ├── data/
│   │   ├── uploads/            # Uploaded files
│   │   └── vector_store/       # Document embeddings
│   ├── .env                    # Environment variables
│   ├── requirements.txt        # Python dependencies
│   └── run.py                  # Server entry point
│
├── client/                      # Frontend (React/Vite)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── HomePage.jsx    # Landing page
│   │   │   ├── UploadPage.jsx  # File upload
│   │   │   ├── AnalysisPage.jsx# Analysis results
│   │   │   └── DashboardPage.jsx# User dashboard
│   │   ├── services/
│   │   │   └── api.js          # API service layer
│   │   ├── App.jsx             # Main app component
│   │   ├── main.jsx            # Entry point
│   │   └── index.css           # Global styles
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js          # Vite configuration
│   ├── tailwind.config.js      # Tailwind CSS config
│   └── postcss.config.js       # PostCSS config
│
├── setup.sh                     # Linux/Mac setup script
├── setup.bat                    # Windows setup script
├── README.md                    # This file
└── LICENSE                      # Project license
```

---

## 📸 Screenshots

### Home Page
<img src="screenshots/home.png" alt="Home Page" width="800"/>
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/9540c0fe-1947-4889-8002-fa93ce0b2b21" />


*Modern landing page with interactive features*

### Upload Page
<img src="screenshots/upload.png" alt="Upload Page" width="800"/>
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/5ca2c56d-2fbf-446d-80c9-6f1bfd2e45c1" />


*Drag-and-drop file upload with progress indicators*

### Analysis Page
<img src="screenshots/analysis.png" alt="Analysis Page" width="800"/>
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/468b0dd2-7745-4dcf-a280-39e237cee7bd" />


*Comprehensive analysis with plagiarism detection and Q&A*

### Dashboard
<img src="screenshots/dashboard.png" alt="Dashboard" width="800"/>
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/76a1ae4b-b68c-4c0d-b7c7-8a269ffd1a00" />


*Manage all analyzed papers in one place*

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Ollama Connection Error

**Problem:** `Cannot connect to Ollama at http://localhost:11434`

**Solution:**
```bash
# Make sure Ollama is running
ollama serve

# Check if Llama 3 is installed
ollama list

# Pull Llama 3 if missing
ollama pull llama3
```

#### 2. Tesseract Not Found

**Problem:** `Tesseract OCR is not available`

**Solution:**
- **Windows:** Install from https://github.com/UB-Mannheim/tesseract/wiki
- **Mac:** `brew install tesseract`
- **Linux:** `sudo apt-get install tesseract-ocr`

Update path in `server/app/image_processor.py` if needed.

#### 3. CORS Errors

**Problem:** `Access-Control-Allow-Origin error`

**Solution:**
- Ensure backend is running before frontend
- Check backend CORS settings in `server/app/main.py`
- Verify frontend URL matches allowed origins

#### 4. PDF Extraction Fails

**Problem:** `No text content could be extracted`

**Solution:**
- Check if PDF is password-protected
- Try a different PDF
- PDF might be image-based (use image upload instead)

#### 5. Port Already in Use

**Problem:** `Port 8000 is already in use`

**Solution:**
```bash
# Find process using port 8000
# Linux/Mac:
lsof -i :8000

# Windows:
netstat -ano | findstr :8000

# Kill the process or change port in run.py
```

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
5. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Code Style

**Python:**
- Follow PEP 8 guidelines
- Use type hints where possible
- Add docstrings to functions

**JavaScript/React:**
- Use ES6+ syntax
- Follow Airbnb style guide
- Use functional components with hooks

### Testing

```bash
# Backend tests (if implemented)
cd server
pytest

# Frontend tests
cd client
npm test
```

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2023 AI Research Analyzer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## 🙏 Acknowledgments

### Technologies
- [Ollama](https://ollama.ai/) - Local LLM runtime
- [Meta Llama 3](https://ai.meta.com/llama/) - Large language model
- [FastAPI](https://fastapi.tiangolo.com/) - Modern Python web framework
- [React](https://react.dev/) - UI library
- [Tesseract OCR](https://github.com/tesseract-ocr/tesseract) - OCR engine
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework

### Contributors
- Your Name - *Initial work* - [@yourusername](https://github.com/yourusername)

### Inspiration
- Research paper analysis tools
- Academic writing assistants
- Modern AI-powered applications

---

## 📞 Support

Having issues? We're here to help!

- 📧 **Email:** sanjeevnidhir05@gmail.com
- 💬 **Discussions:** [GitHub Discussions](https://github.com/sanju234-san/ai-research-analyzer/discussions)
- 🐛 **Bug Reports:** [GitHub Issues](https://github.com/sanju234-san/ai-research-analyzer/issues)

---

## 🗺️ Roadmap

### Current Version (v1.0)
- ✅ PDF text extraction
- ✅ Image OCR
- ✅ AI-powered Q&A
- ✅ Plagiarism detection
- ✅ Keyword extraction
- ✅ Document management

### Upcoming Features (v1.1)
- [ ] Real plagiarism API integration
- [ ] Multiple paper comparison
- [ ] Citation network visualization
- [ ] Export to various formats (DOCX, LaTeX)
- [ ] User authentication
- [ ] Cloud storage integration

### Future Plans (v2.0)
- [ ] Real-time collaboration
- [ ] Advanced analytics dashboard
- [ ] Custom AI model training
- [ ] Mobile app (React Native)
- [ ] Browser extension
- [ ] API rate limiting and authentication

---


<div align="center">

**Made with ❤️ by researchers, for researchers**

[⬆ Back to Top](#-ai-research-paper-analyzer)

</div>
