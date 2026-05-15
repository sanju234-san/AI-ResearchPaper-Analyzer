// client/src/services/api.js
// Updated API service for Groq + LangChain backend v2.0
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ApiService {
  async checkHealth() {
    const res = await fetch(`${API_BASE_URL}/health`);
    return res.json();
    // Returns: { status, llm: "groq/llama3-70b-8192", rag: "langchain+faiss", version }
  }

  async analyzePDF(file, question = null) {
    const formData = new FormData();
    formData.append('file', file);
    if (question) formData.append('question', question);
    const res = await fetch(`${API_BASE_URL}/analyze-pdf`, { method: 'POST', body: formData });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.detail || 'PDF analysis failed');
    }
    return res.json();
    // Returns: { success, doc_id, filename, text_length, extracted_text,
    //            summary (markdown), keywords[], rag_stats{}, answer? }
  }

  async analyzeImage(file, question = null) {
    const formData = new FormData();
    formData.append('file', file);
    if (question) formData.append('question', question);
    const res = await fetch(`${API_BASE_URL}/analyze-image`, { method: 'POST', body: formData });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.detail || 'Image analysis failed');
    }
    return res.json();
  }

  async askQuestion(question) {
    const formData = new FormData();
    formData.append('question', question);
    const res = await fetch(`${API_BASE_URL}/ask-question`, { method: 'POST', body: formData });
    if (!res.ok) throw new Error('Question failed');
    return res.json();
    // Returns: { success, answer, question, source_chunks[], chunks_used }
  }

  async listDocuments() {
    const res = await fetch(`${API_BASE_URL}/documents`);
    if (!res.ok) throw new Error('Failed to fetch documents');
    return res.json();
  }

  async resetStore() {
    const res = await fetch(`${API_BASE_URL}/reset`, { method: 'DELETE' });
    return res.json();
  }
}

export default new ApiService();