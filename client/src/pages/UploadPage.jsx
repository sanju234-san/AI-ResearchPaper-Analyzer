// client/src/pages/UploadPage.jsx
import React, { useState } from 'react';
import api from '../services/api';

const UploadPage = ({ onNavigate, onUploadComplete }) => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [question, setQuestion] = useState('');

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type === 'application/pdf' || droppedFile.type.startsWith('image/'))) {
      setFile(droppedFile);
      setError(null);
    } else {
      setError('Please upload a PDF or image file');
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleStartAnalysis = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(10);
    setError(null);

    try {
      let result;
      
      // Check if file is PDF or image
      if (file.type === 'application/pdf') {
        setUploadProgress(30);
        result = await api.analyzePDF(file, question || null);
      } else if (file.type.startsWith('image/')) {
        setUploadProgress(30);
        result = await api.analyzeImage(file, question || null);
      } else {
        throw new Error('Unsupported file type');
      }

      setUploadProgress(100);

      // Create paper object for dashboard
      const paper = {
        id: Date.now(),
        title: file.name.replace(/\.[^/.]+$/, ""),
        filename: result.filename || file.name,
        authors: "Unknown",
        dateUploaded: new Date().toISOString().split('T')[0],
        status: "Completed",
        textLength: result.text_length || 0,
        extractedText: result.extracted_text || '',
        answer: result.answer || null,
        analysis: result.analysis || null
      };

      // Store in localStorage for persistence
      const existingPapers = JSON.parse(localStorage.getItem('papers') || '[]');
      existingPapers.push(paper);
      localStorage.setItem('papers', JSON.stringify(existingPapers));

      setTimeout(() => {
        onUploadComplete(paper);
      }, 500);

    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.');
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xl">
              📊
            </div>
            <span className="text-xl font-semibold text-gray-800">AI Research Paper Analysis</span>
          </div>
          <button 
            onClick={() => onNavigate('home')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Home
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-8 py-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-4 text-center">Analyze Paper</h1>
        <p className="text-xl text-gray-600 mb-12 text-center">
          Upload your research paper to get started.
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Upload Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-16 text-center mb-8 transition-colors ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'
          }`}
        >
          <div className="flex flex-col items-center">
            <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Drag and drop your research paper here
            </h2>
            <p className="text-gray-500 mb-6">Supported formats: PDF, Image (PNG, JPG, JPEG)</p>
            
            <label className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg cursor-pointer hover:bg-gray-300 transition-colors">
              Or browse your files
              <input
                type="file"
                accept=".pdf,image/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={isUploading}
              />
            </label>

            {file && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg w-full max-w-md">
                <p className="text-blue-900 font-medium">📄 {file.name}</p>
                <p className="text-blue-700 text-sm mt-1">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Optional Question */}
        <div className="mb-8">
          <label className="block text-gray-700 font-medium mb-2">
            Ask a question about the paper (optional)
          </label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g., What is the main contribution of this paper?"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isUploading}
          />
        </div>

        {/* Upload Progress */}
        {isUploading && (
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Uploading and analyzing...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Start Analysis Button */}
        <button
          onClick={handleStartAnalysis}
          disabled={!file || isUploading}
          className={`w-full py-4 rounded-lg text-lg font-semibold transition-colors ${
            file && !isUploading
              ? 'bg-gray-800 text-white hover:bg-gray-900'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isUploading ? 'Analyzing...' : 'Start Analysis'}
        </button>

        <p className="text-center text-gray-500 mt-6">
          Your file will be securely processed and analyzed using AI.
        </p>
      </main>
    </div>
  );
};

export default UploadPage;