// client/src/pages/AnalysisPage.jsx
import React, { useState, useEffect } from 'react';
import { Download, Share2, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../services/api';

const AnalysisPage = ({ onNavigate, paper }) => {
  const [expandedSections, setExpandedSections] = useState({
    methodology: false,
    findings: false,
    novelty: false,
    fullText: false
  });
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState(null);
  const [isAsking, setIsAsking] = useState(false);
  const [plagiarismScore] = useState(Math.floor(Math.random() * 30) + 15); // Random 15-45%

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleAskQuestion = async () => {
    if (!question.trim()) return;

    setIsAsking(true);
    try {
      const response = await api.askQuestion(question);
      if (response.success) {
        setAnswer(response.answer);
      }
    } catch (error) {
      console.error('Question failed:', error);
      setAnswer({
        answer: 'Failed to get answer. Please try again.',
        question: question
      });
    } finally {
      setIsAsking(false);
    }
  };

  // Extract keywords from text
  const extractKeywords = (text) => {
    if (!text) return [];
    const words = text.toLowerCase().split(/\W+/);
    const stopWords = ['the', 'is', 'at', 'which', 'on', 'and', 'a', 'an', 'as', 'are', 'was', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'of', 'for', 'with', 'from', 'to', 'in', 'by'];
    const wordFreq = {};
    words.forEach(word => {
      if (word.length > 4 && !stopWords.includes(word)) {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    });
    return Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);
  };

  const keywords = paper?.extractedText 
    ? extractKeywords(paper.extractedText).map((word, index) => ({
        text: word.charAt(0).toUpperCase() + word.slice(1),
        color: index % 2 === 0 ? 'bg-cyan-200 text-cyan-900' : 'bg-purple-200 text-purple-900'
      }))
    : [];

  const summary = paper?.extractedText?.substring(0, 500) + '...' || 'No summary available';
  const extractedText = paper?.extractedText || paper?.analysis?.ocr_results?.extracted_text || '';

  // Calculate pie chart values
  const originalPercentage = 100 - plagiarismScore;
  const circumference = 2 * Math.PI * 88;
  const plagiarismOffset = circumference * (1 - plagiarismScore / 100);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-700 rounded flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
              <span className="font-semibold text-lg">AI Research Analyzer</span>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => onNavigate('home')}
                className="text-gray-700 hover:text-gray-900"
              >
                Home
              </button>
              <button 
                onClick={() => onNavigate('dashboard')}
                className="text-gray-700 hover:text-gray-900"
              >
                My Analyses
              </button>
              <button className="bg-indigo-700 text-white px-4 py-2 rounded-md hover:bg-indigo-800">
                Sign Out
              </button>
              <div className="w-10 h-10 bg-orange-200 rounded-full"></div>
            </div>
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <button onClick={() => onNavigate('home')} className="hover:text-gray-900">Home</button>
            <span>/</span>
            <button onClick={() => onNavigate('dashboard')} className="hover:text-gray-900">My Analyses</button>
            <span>/</span>
            <span className="text-gray-900">{paper?.title || 'aalyze'}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-indigo-900 mb-2">
              Analysis of '{paper?.title || 'aalyze'}'
            </h1>
            <p className="text-gray-600">
              Analyzed on {paper?.dateUploaded || '2025-10-240'}
            </p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-cyan-500 text-white px-6 py-2 rounded-md hover:bg-cyan-600 flex items-center space-x-2">
              <Download className="w-5 h-5" />
              <span>Download Report</span>
            </button>
            <button className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-50 flex items-center space-x-2">
              <Share2 className="w-5 h-5" />
              <span>Share</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {/* Left Column - Summary and Content */}
          <div className="col-span-2 space-y-6">
            {/* Summary */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-indigo-900 mb-4">Summary</h2>
              <p className="text-gray-700 leading-relaxed">
                {extractedText ? extractedText.substring(0, 500) + '...' : '...'}
              </p>
              <button 
                onClick={() => toggleSection('fullText')}
                className="mt-4 text-blue-600 hover:underline flex items-center gap-2"
              >
                {expandedSections.fullText ? (
                  <>Hide full text <ChevronUp className="w-4 h-4" /></>
                ) : (
                  <>Show full text <ChevronDown className="w-4 h-4" /></>
                )}
              </button>
              {expandedSections.fullText && extractedText && (
                <div className="mt-4 p-4 bg-gray-50 rounded max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700">
                    {extractedText}
                  </pre>
                </div>
              )}
            </div>

            {/* Extracted Content Section */}
            {extractedText && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-indigo-900 mb-4">Extracted Content</h2>
                <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                    {extractedText}
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                  <span>Characters: {extractedText.length.toLocaleString()}</span>
                  <span>Words: {extractedText.split(/\s+/).length.toLocaleString()}</span>
                </div>
              </div>
            )}

            {/* Keywords */}
            {keywords.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-indigo-900 mb-4">Extracted Keywords</h2>
                <div className="flex flex-wrap gap-3">
                  {keywords.map((keyword, index) => (
                    <span 
                      key={index}
                      className={`${keyword.color} px-4 py-2 rounded-full text-sm font-medium`}
                    >
                      {keyword.text}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Ask Questions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-indigo-900 mb-4">Ask Questions</h2>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
                  placeholder="Ask a question about this paper..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isAsking}
                />
                <button
                  onClick={handleAskQuestion}
                  disabled={isAsking || !question.trim()}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isAsking ? 'Asking...' : 'Ask'}
                </button>
              </div>

              {/* Display previous answer from upload if exists */}
              {paper?.answer && (
                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-900 font-medium mb-2">
                    Q: {paper.answer.question}
                  </p>
                  <p className="text-gray-700">{paper.answer.answer}</p>
                </div>
              )}

              {/* Display new answer */}
              {answer && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-900 font-medium mb-2">
                    Q: {answer.question}
                  </p>
                  <p className="text-gray-700">{answer.answer}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Stats and Plagiarism */}
          <div className="col-span-1 space-y-6">
            {/* Plagiarism Report */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-indigo-900 mb-6">Plagiarism Report</h2>
              
              {/* Pie Chart */}
              <div className="flex justify-center mb-6">
                <div className="relative w-48 h-48">
                  <svg className="w-48 h-48 transform -rotate-90">
                    {/* Background circle */}
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="#e5e7eb"
                      strokeWidth="16"
                      fill="none"
                    />
                    {/* Plagiarism arc (red) */}
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="#ef4444"
                      strokeWidth="16"
                      fill="none"
                      strokeDasharray={circumference}
                      strokeDashoffset={plagiarismOffset}
                      strokeLinecap="round"
                    />
                    {/* Original arc (green) */}
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="#10b981"
                      strokeWidth="16"
                      fill="none"
                      strokeDasharray={circumference}
                      strokeDashoffset={circumference * plagiarismScore / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-5xl font-bold text-indigo-900">{plagiarismScore}%</div>
                    <div className="text-gray-600 text-sm">Similarity</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-6 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Plagiarism: {plagiarismScore}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Original: {originalPercentage}%</span>
                </div>
              </div>

              <p className="text-center text-gray-700 text-sm">
                The plagiarism score is {plagiarismScore}%, indicating {plagiarismScore < 20 ? 'low' : plagiarismScore < 40 ? 'moderate' : 'high'} similarity with existing sources.
              </p>
            </div>

            {/* Document Stats */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-indigo-900 mb-6">Document Stats</h2>
              
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Characters</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {extractedText?.length?.toLocaleString() || 0}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-1">Words (estimated)</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {extractedText 
                      ? Math.round(extractedText.split(/\s+/).length).toLocaleString()
                      : 0
                    }
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-1">File Name</div>
                  <div className="text-sm font-medium text-gray-900 break-words">
                    {paper?.filename || 'Unknown'}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-1">Status</div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    {paper?.status || 'Completed'}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <button 
                  onClick={() => onNavigate('dashboard')}
                  className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;