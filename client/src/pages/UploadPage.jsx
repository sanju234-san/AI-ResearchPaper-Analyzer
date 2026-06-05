import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import NavBar from '../components/NavBar';
import LoadingOverlay from '../components/LoadingOverlay';

import config from '../config.js';
const API_BASE_URL = config.apiBaseUrl;

const UploadPage = ({ onNavigate, onUploadComplete, userName }) => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [question, setQuestion] = useState('');

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault(); setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f && (f.type === 'application/pdf' || f.type.startsWith('image/'))) { setFile(f); setError(null); }
    else setError('Please upload a PDF or image file');
  };
  const handleFileSelect = (e) => { 
    const f = e.target.files[0];
    if (f) { 
      if (f.type === 'application/pdf' || f.type.startsWith('image/')) {
        setFile(f); 
        setError(null); 
      } else {
        setError('Please upload a PDF or image file');
      }
    } 
  };

  const handleStartAnalysis = async () => {
    if (!file) return;
    setIsUploading(true); setUploadProgress(0); setError(null);
    try {
      const interval = setInterval(() => {
        setUploadProgress(p => { if (p >= 90) { clearInterval(interval); return p; } return p + 2; });
      }, 100);

      const formData = new FormData();
      formData.append('file', file);
      if (question) formData.append('question', question);

      const headers = {};
      const token = document.cookie.split('; ').find(cookie => cookie.startsWith('auth_token='))?.split('=')[1];
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const endpoint = file.type === 'application/pdf' ? '/analyze-pdf' : '/analyze-image';
      const res = await fetch(`${API_BASE_URL}${endpoint}`, { method: 'POST', body: formData, headers });
      if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.detail || 'Analysis failed'); }
      const result = await res.json();

      clearInterval(interval);
      setUploadProgress(100);

      const paper = {
        id: Date.now(),
        doc_id: result.doc_id,
        title: file.name.replace(/\.[^/.]+$/, ""),
        filename: result.filename || file.name,
        authors: "Unknown",
        dateUploaded: new Date().toLocaleDateString(),
        status: "Completed",
        textLength: result.text_length || 0,
        extractedText: result.extracted_text || '',
        summary: result.summary || '',
        keywords: result.keywords || [],
        ragStats: result.rag_stats || {},
        plagiarism: result.plagiarism || null,
        answer: result.answer || null,
      };

      const papers = JSON.parse(localStorage.getItem('papers') || '[]');
      papers.push(paper);
      localStorage.setItem('papers', JSON.stringify(papers));
      setTimeout(() => onUploadComplete(paper), 1200);
    } catch (err) {
      setError(err.message || 'Upload failed');
      setUploadProgress(0); setIsUploading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="min-h-screen bg-primary"
    >
      {isUploading && <LoadingOverlay uploadProgress={uploadProgress} fileName={file?.name || 'Document'} />}
      <NavBar onNavigate={onNavigate} userName={userName} />

      <main className="max-w-2xl mx-auto px-6 pt-28 pb-16">
        <div className="text-center mb-10 animate-slide-up">
          <h1 className="font-display text-4xl font-bold text-white mb-2">Analyze Paper</h1>
          <p className="text-gray-500">Upload your research paper for AI-powered analysis</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">{error}</div>
        )}

        <div
          onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-12 text-center mb-6 transition-all cursor-pointer ${
            isDragging ? 'border-mint bg-mint/5 scale-[1.01]' : 'border-white/10 bg-white/[0.02] hover:border-mint/30 hover:bg-mint/[0.02]'
          }`}
          onClick={() => document.getElementById('file-input').click()}
        >
          <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragging ? 'text-mint' : 'text-gray-600'}`} />
          <h2 className="text-xl font-semibold text-white mb-1">Drag and drop your research paper</h2>
          <p className="text-gray-500 text-sm mb-4">PDF, PNG, JPG, JPEG — up to 20MB</p>
          <label className="inline-block bg-white/5 border border-white/10 text-gray-300 px-6 py-2.5 rounded-lg cursor-pointer hover:bg-white/10 transition-all text-sm">
            Browse Files
            <input id="file-input" type="file" accept=".pdf,image/*" onChange={handleFileSelect} className="hidden" disabled={isUploading} />
          </label>

          {file && (
            <div className="mt-6 p-4 glass-card inline-flex items-center gap-3">
              <span className="text-mint text-lg">✓</span>
              <div className="text-left">
                <p className="text-white text-sm font-medium">{file.name}</p>
                <p className="text-gray-500 text-xs">{(file.size / 1024 / 1024).toFixed(2)} MB • {file.type === 'application/pdf' ? 'PDF' : 'Image'}</p>
              </div>
            </div>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">Ask a question (optional)</label>
          <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g., What is the main contribution of this paper?"
            className="w-full px-4 py-3 bg-secondary border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-mint focus:ring-1 focus:ring-mint/30 transition-all"
            disabled={isUploading} />
        </div>

        <button onClick={handleStartAnalysis} disabled={!file || isUploading}
          className={`w-full py-4 rounded-xl text-base font-semibold transition-all ${
            file && !isUploading
              ? 'bg-mint text-black hover:bg-mint-dim mint-glow-hover transform hover:scale-[1.02]'
              : 'bg-white/10 text-gray-600 cursor-not-allowed'
          }`}>
          {isUploading ? 'Analyzing with AI...' : 'Start Analysis'}
        </button>
      </main>
    </motion.div>
  );
};

export default UploadPage;