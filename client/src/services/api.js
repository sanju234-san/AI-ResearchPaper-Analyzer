// client/src/services/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ApiService {
  // Health check
  async checkHealth() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }

  // Check Ollama status
  async checkOllamaStatus() {
    try {
      const response = await fetch(`${API_BASE_URL}/ollama-status`);
      return await response.json();
    } catch (error) {
      console.error('Ollama status check failed:', error);
      throw error;
    }
  }

  // Upload and analyze PDF
  async analyzePDF(file, question = null) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (question) {
        formData.append('question', question);
      }

      const response = await fetch(`${API_BASE_URL}/analyze-pdf`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'PDF analysis failed');
      }

      return await response.json();
    } catch (error) {
      console.error('PDF analysis error:', error);
      throw error;
    }
  }

  // Upload and analyze image
  async analyzeImage(file, question = null) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (question) {
        formData.append('question', question);
      }

      const response = await fetch(`${API_BASE_URL}/analyze-image`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Image analysis failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Image analysis error:', error);
      throw error;
    }
  }

  // Ask a question
  async askQuestion(question) {
    try {
      const formData = new FormData();
      formData.append('question', question);

      const response = await fetch(`${API_BASE_URL}/ask-question`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Question failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Question error:', error);
      throw error;
    }
  }

  // List all documents
  async listDocuments() {
    try {
      const response = await fetch(`${API_BASE_URL}/documents`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }

      return await response.json();
    } catch (error) {
      console.error('List documents error:', error);
      throw error;
    }
  }

  // Get paper overview
  async getPaperOverview() {
    try {
      const response = await fetch(`${API_BASE_URL}/paper-overview`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch paper overview');
      }

      return await response.json();
    } catch (error) {
      console.error('Paper overview error:', error);
      throw error;
    }
  }
}

export default new ApiService();