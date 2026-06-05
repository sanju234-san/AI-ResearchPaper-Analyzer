# 🧠 Paperlytics — AI Research Paper Analyzer

> An advanced, full-stack, AI-powered platform for extracting deep insights from academic research papers. Built with an asynchronous LangChain RAG pipeline, Groq's high-speed inference, and a premium React-driven user interface.

## 🚀 Overview

Paperlytics is designed to solve the problem of information overload in academia and software engineering. It ingests complex research PDFs or images and utilizes advanced Retrieval-Augmented Generation (RAG) to provide **concurrent, multi-modal analysis**. 

Users can securely authenticate via Google OAuth, upload documents, and instantly explore their papers across three distinct dimensions: **Detailed Summarization**, **Code & Implementation Extraction**, and **Aspect-Oriented Methodology Analysis**. All insights and historical analyses are securely persisted in MongoDB.

---

## 🏗️ Architecture & Tech Stack

This application was engineered with a strict separation of concerns, focusing on scalability, asynchronous processing, and a seamless "Dark Luxury Tech" user experience.

### Backend (Python / FastAPI)
* **Framework:** FastAPI (for high-performance, asynchronous routing)
* **AI & RAG Pipeline:** LangChain
* **LLM Engine:** Groq API (`llama-3.3-70b-versatile`) — Chosen for ultra-low latency inference.
* **Embeddings:** HuggingFace `sentence-transformers/all-MiniLM-L6-v2`
* **Vector Store:** FAISS (Facebook AI Similarity Search) for rapid semantic retrieval.
* **Database:** MongoDB Atlas (via Motor for async Python interactions)
* **Security:** JWT-based session management.

### Frontend (React / Vite)
* **Core:** React 18 & Vite
* **Routing:** React Router DOM (v6)
* **Styling:** Tailwind CSS (customized with Deep Navy, Mint Green, and glassmorphism utilities)
* **Animation:** Framer Motion (for route transitions, dynamic layout changes, and staggering statistics counters)
* **Authentication:** Google Identity Services (GSI) via `@react-oauth/google` principles.
* **Data Visualization:** Recharts (for dashboard analytics)

---

## ✨ Key Engineering Features

1. **Asynchronous Multi-Modal RAG Processing**
   * Rather than processing sequentially, the LangChain RAG system utilizes `asyncio.gather` to execute the Detailed, Code-Based, and Aspect-Oriented prompts concurrently. This drastically reduces the Time-To-First-Token (TTFT) and overall wait time for the user.
2. **Context-Aware Q&A System**
   * Incorporates an interactive chatbot tied to the uploaded paper's vector embeddings, enabling strict, fact-grounded Q&A that refuses to hallucinate beyond the source text.
3. **Singleton AI Patterns**
   * The HuggingFace embedding models and Groq LLM clients are instantiated using Singleton patterns to prevent memory leaks and redundant warm-up delays across API calls.
4. **Modern OAuth 2.0 Flow**
   * Implements the modern Google Identity Services (GSI) popup flow. JWTs are acquired client-side, verified and decoded locally, and securely traded for application-specific JWTs via the FastAPI backend.
5. **Premium UX Engineering**
   * Employs `AnimatePresence` and `motion.div` wrappers to ensure fluid page transitions. Features complex CSS keyframe background animations (floating orbs) and high-fidelity UI elements that do not compromise performance.

---

## 🛠️ Local Development Setup

### Prerequisites
* Python 3.10+
* Node.js 18+
* Active [Groq API Key](https://console.groq.com/)
* Active [MongoDB Atlas Cluster](https://www.mongodb.com/cloud/atlas/register)
* [Google Cloud Console](https://console.cloud.google.com/) OAuth Client ID

### 1. Environment Configuration

Create a `.env` file in the **`/server`** directory:
```env
GROQ_API_KEY=YOUR_GROQ_API_KEY
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0...
SECRET_KEY=your_secure_random_string_for_jwts
```

Create a `.env` file in the **`/client`** directory:
```env
VITE_API_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=YOUR_VITE_GOOGLE_CLIENT_ID
```

### 2. Start the Backend
```bash
cd server
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
pip install -r requirements.txt
python run.py
```
*The FastAPI server will boot up at `http://localhost:8000`. Models will automatically cache locally on the first run.*

### 3. Start the Frontend
```bash
cd client
npm install
npm run dev
```
*The React app will boot up at `http://localhost:5173`. Navigate here to experience the platform.*

---

## 📈 Future Roadmap
* **Streaming Responses:** Transition from asynchronous batch generation to full Server-Sent Events (SSE) streaming for real-time typing feedback in the UI.
* **Multi-Document Chat:** Expand the FAISS index to support cross-referencing multiple papers within the same workspace.
* **Citation Mapping:** Implement graph-based visual layouts showing connections between referenced papers.

---
*Developed by Sanjeevni Dhir — GenAI Engineer | SRM University Delhi-NCR*
