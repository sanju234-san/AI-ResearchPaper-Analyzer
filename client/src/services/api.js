// client/src/services/api.js
// Updated API service for Groq + LangChain backend v2.0
const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:8000';
  }
  return 'https://paperlytics-65uw.onrender.com';
};
const API_BASE = getApiBaseUrl();

class ApiService {
  async checkHealth() {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  }

  async analyzePDF(file, question = null) {
    const formData = new FormData();
    formData.append('file', file);
    if (question) formData.append('question', question);
    const res = await fetch(`${API_BASE}/analyze-pdf`, { method: 'POST', body: formData });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.detail || 'PDF analysis failed');
    }
    return res.json();
  }

  async analyzeImage(file, question = null) {
    const formData = new FormData();
    formData.append('file', file);
    if (question) formData.append('question', question);
    const res = await fetch(`${API_BASE}/analyze-image`, { method: 'POST', body: formData });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.detail || 'Image analysis failed');
    }
    return res.json();
  }

  async askQuestion(question) {
    const formData = new FormData();
    formData.append('question', question);
    const res = await fetch(`${API_BASE}/ask-question`, { method: 'POST', body: formData });
    if (!res.ok) throw new Error('Question failed');
    return res.json();
  }

  async listDocuments() {
    const res = await fetch(`${API_BASE}/documents`);
    if (!res.ok) throw new Error('Failed to fetch documents');
    return res.json();
  }

  async resetStore() {
    const res = await fetch(`${API_BASE}/reset`, { method: 'DELETE' });
    return res.json();
  }
}

export default new ApiService();