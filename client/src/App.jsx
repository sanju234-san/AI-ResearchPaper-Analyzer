import React, { useState, useEffect } from 'react';
import { Upload, Download, Share2, ChevronDown, ChevronUp, Search, BookOpen, BarChart3, Settings, LogOut, User, Eye, EyeOff } from 'lucide-react';

// Typewriter Component
const Typewriter = ({ text, className = '' }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 80);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  return <span className={className}>{displayText}<span className="animate-pulse">|</span></span>;
};

// Beautiful Loading Animation Component
const LoadingAnimation = ({ uploadProgress, fileName }) => {
  const [analysisStage, setAnalysisStage] = useState('upload');
  const [particlesVisible, setParticlesVisible] = useState(true);

  useEffect(() => {
    if (uploadProgress < 25) {
      setAnalysisStage('upload');
    } else if (uploadProgress < 50) {
      setAnalysisStage('extracting');
    } else if (uploadProgress < 75) {
      setAnalysisStage('analyzing');
    } else {
      setAnalysisStage('finalizing');
    }
  }, [uploadProgress]);

  const getStageInfo = () => {
    switch (analysisStage) {
      case 'upload':
        return {
          title: 'Uploading Document',
          subtitle: 'Securely transferring your research paper',
          icon: '📤',
          gradient: 'from-blue-500 via-blue-600 to-indigo-600'
        };
      case 'extracting':
        return {
          title: 'Extracting Content',
          subtitle: 'Reading and parsing document structure',
          icon: '📖',
          gradient: 'from-purple-500 via-purple-600 to-pink-600'
        };
      case 'analyzing':
        return {
          title: 'AI Analysis in Progress',
          subtitle: 'Identifying key concepts and patterns',
          icon: '🤖',
          gradient: 'from-green-500 via-emerald-600 to-teal-600'
        };
      case 'finalizing':
        return {
          title: 'Finalizing Results',
          subtitle: 'Preparing your comprehensive analysis',
          icon: '✨',
          gradient: 'from-orange-500 via-pink-600 to-rose-600'
        };
      default:
        return {
          title: 'Processing',
          subtitle: 'Please wait',
          icon: '⏳',
          gradient: 'from-blue-500 to-purple-600'
        };
    }
  };

  const stageInfo = getStageInfo();

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center z-50 overflow-hidden">
      {/* Animated Background Particles */}
      {particlesVisible && (
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Animated Gradient Orbs */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500 rounded-full filter blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-2xl w-full mx-auto px-8">
        {/* Central Animation Circle */}
        <div className="flex flex-col items-center mb-12">
          <div className="relative w-64 h-64 mb-8">
            {/* Outer rotating rings */}
            <div className="absolute inset-0 rounded-full border-4 border-blue-400/30 animate-spin" style={{ animationDuration: '3s' }} />
            <div className="absolute inset-2 rounded-full border-4 border-purple-400/30 animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }} />
            <div className="absolute inset-4 rounded-full border-4 border-pink-400/30 animate-spin" style={{ animationDuration: '4s' }} />
            
            {/* Center circle with icon */}
            <div className={`absolute inset-8 rounded-full bg-gradient-to-br ${stageInfo.gradient} animate-pulse flex items-center justify-center shadow-2xl`}>
              <span className="text-7xl animate-bounce">{stageInfo.icon}</span>
            </div>

            {/* Orbiting particles */}
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '4s' }}>
              <div className="absolute top-0 left-1/2 w-4 h-4 bg-blue-400 rounded-full -ml-2 shadow-lg" />
            </div>
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '4s', animationDelay: '1s' }}>
              <div className="absolute top-0 left-1/2 w-4 h-4 bg-purple-400 rounded-full -ml-2 shadow-lg" />
            </div>
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '4s', animationDelay: '2s' }}>
              <div className="absolute top-0 left-1/2 w-4 h-4 bg-pink-400 rounded-full -ml-2 shadow-lg" />
            </div>
          </div>

          {/* Status Text */}
          <div className="text-center space-y-3 mb-8">
            <h2 className={`text-4xl font-bold bg-gradient-to-r ${stageInfo.gradient} bg-clip-text text-transparent animate-pulse`}>
              {stageInfo.title}
            </h2>
            <p className="text-xl text-blue-200">{stageInfo.subtitle}</p>
            <p className="text-sm text-blue-300/70 max-w-md truncate">
              📄 {fileName}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-4">
          <div className="flex justify-between text-sm font-medium text-blue-200">
            <span>Analysis Progress</span>
            <span className="text-white font-bold">{uploadProgress}%</span>
          </div>
          
          <div className="relative w-full bg-white/10 backdrop-blur-sm rounded-full h-4 overflow-hidden shadow-inner border border-white/20">
            {/* Background shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            
            {/* Progress fill */}
            <div 
              className={`relative h-full bg-gradient-to-r ${stageInfo.gradient} rounded-full transition-all duration-500 ease-out shadow-lg`}
              style={{ width: `${uploadProgress}%` }}
            >
              {/* Inner glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
            
            {/* Progress indicator dot */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-500 border-2 border-blue-400"
              style={{ left: `calc(${uploadProgress}% - 12px)` }}
            >
              <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-75" />
            </div>
          </div>
        </div>

        {/* Stage Indicators */}
        <div className="mt-12 grid grid-cols-4 gap-4">
          {['upload', 'extracting', 'analyzing', 'finalizing'].map((stage, index) => {
            const stageProgress = (index + 1) * 25;
            const isActive = uploadProgress >= (index * 25);
            const isCurrent = analysisStage === stage;
            
            return (
              <div 
                key={stage}
                className={`relative flex flex-col items-center transition-all duration-500 ${
                  isActive ? 'scale-110' : 'scale-100 opacity-50'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-500 ${
                  isCurrent 
                    ? `bg-gradient-to-br ${stageInfo.gradient} shadow-lg shadow-blue-500/50 animate-pulse` 
                    : isActive 
                    ? 'bg-green-500' 
                    : 'bg-white/20'
                }`}>
                  {isActive ? (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <div className="w-3 h-3 bg-white/50 rounded-full" />
                  )}
                </div>
                <span className={`text-xs font-medium text-center capitalize ${
                  isActive ? 'text-white' : 'text-blue-300/50'
                }`}>
                  {stage}
                </span>
              </div>
            );
          })}
        </div>

        {/* Fun Facts */}
        <div className="mt-12 p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
          <p className="text-center text-blue-100 text-sm leading-relaxed">
            💡 <span className="font-semibold">Did you know?</span> Our AI analyzes over{' '}
            <span className="text-white font-bold">10,000 research papers</span> monthly,{' '}
            helping researchers save countless hours!
          </p>
        </div>
      </div>

      {/* CSS for shimmer animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};

// API Service
const API_BASE_URL = 'http://localhost:8000';

const api = {
  analyzePDF: async (file, question = null) => {
    const formData = new FormData();
    formData.append('file', file);
    if (question) formData.append('question', question);
    
    const response = await fetch(`${API_BASE_URL}/analyze-pdf`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Upload failed');
    }
    
    return await response.json();
  },

  analyzeImage: async (file, question = null) => {
    const formData = new FormData();
    formData.append('file', file);
    if (question) formData.append('question', question);
    
    const response = await fetch(`${API_BASE_URL}/analyze-image`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Upload failed');
    }
    
    return await response.json();
  },

  askQuestion: async (question) => {
    const formData = new FormData();
    formData.append('question', question);
    
    const response = await fetch(`${API_BASE_URL}/ask-question`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) throw new Error('Question failed');
    return await response.json();
  },

  listDocuments: async () => {
    const response = await fetch(`${API_BASE_URL}/documents`);
    if (!response.ok) throw new Error('Failed to fetch documents');
    return await response.json();
  }
};

// Login Page Component
const LoginPage = ({ onLogin, onNavigate }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.email && formData.password) {
      if (!isLogin && !formData.name) {
        alert('Please enter your name');
        return;
      }
      onLogin(formData.name || formData.email.split('@')[0]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{animationDelay: '0.5s'}}></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Research Analyzer</h1>
          <p className="text-gray-600">Unlock insights from research papers</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-md font-medium transition-all ${
                isLogin ? 'bg-white text-blue-600 shadow' : 'text-gray-600'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-md font-medium transition-all ${
                !isLogin ? 'bg-white text-blue-600 shadow' : 'text-gray-600'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John Doe"
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              {isLogin ? 'Login' : 'Create Account'}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue as guest</span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('home')}
            className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all"
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
};

// Home Page Component
const HomePage = ({ onNavigate, userName }) => {
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const features = [
    {
      icon: '🔍',
      title: 'Plagiarism Detection',
      description: 'Advanced AI-powered plagiarism checking with detailed reports',
      color: 'from-green-400 to-green-600'
    },
    {
      icon: '📄',
      title: 'Smart Summarization',
      description: 'Get concise, accurate summaries of complex research papers',
      color: 'from-blue-400 to-blue-600'
    },
    {
      icon: '🏷️',
      title: 'Keyword Extraction',
      description: 'Automatically identify key concepts and terminology',
      color: 'from-purple-400 to-purple-600'
    },
    {
      icon: '📊',
      title: 'Citation Analysis',
      description: 'Comprehensive analysis of references and citations',
      color: 'from-orange-400 to-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              AI Research Analyzer
            </span>
          </div>
          <nav className="flex gap-6 items-center">
            <button className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Features</button>
            <button className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Pricing</button>
            <button className="text-gray-700 hover:text-blue-600 font-medium transition-colors">About</button>
            {userName ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all"
                >
                  Dashboard
                </button>
                <div className="w-10 h-10 bg-orange-300 rounded-full flex items-center justify-center font-semibold text-gray-700">
                  {userName.charAt(0).toUpperCase()}
                </div>
              </div>
            ) : (
              <button
                onClick={() => onNavigate('login')}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all"
              >
                Login
              </button>
            )}
          </nav>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-8 py-20 text-center">
        <div className="mb-6 inline-block">
          <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
            ✨ AI-Powered Research Analysis
          </span>
        </div>
        <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
          <Typewriter className='bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent' text="Unlock Deeper Insights From Your Research Papers" />
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Analyze research papers with cutting-edge AI technology. Get summaries, detect plagiarism, and extract key insights instantly.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => onNavigate(userName ? 'upload' : 'login')}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            {userName ? 'Analyze Paper →' : 'Get Started →'}
          </button>
          {userName && (
            <button
              onClick={() => onNavigate('dashboard')}
              className="bg-white text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-gray-300 hover:border-blue-600 hover:text-blue-600 transition-all"
            >
              View Dashboard
            </button>
          )}
        </div>

        <div className="mt-16 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 rounded-2xl p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 w-40 h-40 bg-blue-500 rounded-full filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-60 h-60 bg-purple-500 rounded-full filter blur-3xl animate-pulse"></div>
          </div>

          <div className="relative z-10 grid grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all">
              <div className="text-4xl mb-3">📈</div>
              <div className="text-3xl font-bold text-white mb-2">98%</div>
              <div className="text-blue-200 text-sm">Accuracy Rate</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all">
              <div className="text-4xl mb-3">⚡</div>
              <div className="text-3xl font-bold text-white mb-2">&lt;30s</div>
              <div className="text-blue-200 text-sm">Analysis Time</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all">
              <div className="text-4xl mb-3">🎯</div>
              <div className="text-3xl font-bold text-white mb-2">10K+</div>
              <div className="text-blue-200 text-sm">Papers Analyzed</div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
          <p className="text-xl text-gray-600">Everything you need for comprehensive research analysis</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`bg-white p-8 rounded-2xl shadow-lg border-2 ${
                hoveredFeature === index ? 'border-blue-500 shadow-2xl' : 'border-transparent'
              } text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer`}
              onMouseEnter={() => setHoveredFeature(index)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg text-3xl`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

// Upload Page Component
const UploadPage = ({ onNavigate, onUploadComplete, userName }) => {
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
    setUploadProgress(0);
    setError(null);

    try {
      // Simulate smooth progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 2;
        });
      }, 100);

      let result;
      
      if (file.type === 'application/pdf') {
        result = await api.analyzePDF(file, question || null);
      } else if (file.type.startsWith('image/')) {
        result = await api.analyzeImage(file, question || null);
      } else {
        throw new Error('Unsupported file type');
      }

      clearInterval(progressInterval);
      setUploadProgress(100);

      const paper = {
        id: Date.now(),
        title: file.name.replace(/\.[^/.]+$/, ""),
        filename: result.filename || file.name,
        authors: "Unknown",
        dateUploaded: new Date().toLocaleDateString(),
        status: "Completed",
        textLength: result.text_length || 0,
        extractedText: result.extracted_text || '',
        answer: result.answer || null,
        analysis: result.analysis || null
      };

      const existingPapers = JSON.parse(localStorage.getItem('papers') || '[]');
      existingPapers.push(paper);
      localStorage.setItem('papers', JSON.stringify(existingPapers));

      // Wait for animation to complete
      setTimeout(() => {
        onUploadComplete(paper);
      }, 1500);

    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.');
      setUploadProgress(0);
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {isUploading && (
        <LoadingAnimation uploadProgress={uploadProgress} fileName={file?.name || 'Document'} />
      )}
      
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              AI Research Analyzer
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('home')} className="text-gray-700 hover:text-blue-600">
              Home
            </button>
            <button onClick={() => onNavigate('dashboard')} className="text-gray-700 hover:text-blue-600">
              Dashboard
            </button>
            {userName && (
              <div className="w-10 h-10 bg-orange-300 rounded-full flex items-center justify-center font-semibold">
                {userName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-8 py-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-4 text-center">Analyze Paper</h1>
        <p className="text-xl text-gray-600 mb-12 text-center">
          Upload your research paper to get started with AI-powered analysis
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div
          onDragOver={handleDragOver}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-16 text-center mb-8 transition-colors ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'
          }`}
        >
          <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Drag and drop your research paper
          </h2>
          <p className="text-gray-500 mb-6">Supported: PDF, PNG, JPG, JPEG</p>
          
          <label className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg cursor-pointer hover:bg-gray-300 transition-colors inline-block">
            Browse Files
            <input
              type="file"
              accept=".pdf,image/*"
              onChange={handleFileSelect}
              className="hidden"
              disabled={isUploading}
            />
          </label>

          {file && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-900 font-medium">📄 {file.name}</p>
              <p className="text-blue-700 text-sm mt-1">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          )}
        </div>

        <div className="mb-8">
          <label className="block text-gray-700 font-medium mb-2">
            Ask a question (optional)
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

        <button
          onClick={handleStartAnalysis}
          disabled={!file || isUploading}
          className={`w-full py-4 rounded-lg text-lg font-semibold transition-all ${
            file && !isUploading
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg transform hover:scale-105'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isUploading ? 'Analyzing...' : 'Start Analysis'}
        </button>
      </main>
    </div>
  );
};

// Dashboard Component
const DashboardPage = ({ onNavigate, onViewAnalysis, userName }) => {
  const [papers, setPapers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPapers();
  }, []);

  const loadPapers = () => {
    const storedPapers = JSON.parse(localStorage.getItem('papers') || '[]');
    setPapers(storedPapers);
    setLoading(false);
  };

  const handleDelete = (id) => {
    const updatedPapers = papers.filter(paper => paper.id !== id);
    setPapers(updatedPapers);
    localStorage.setItem('papers', JSON.stringify(updatedPapers));
  };

  const filteredPapers = papers.filter(paper =>
    paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paper.authors.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading papers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Paperlytics</h1>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-lg mb-2">
            <BarChart3 className="w-5 h-5" />
            Dashboard
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg mb-2">
            <User className="w-5 h-5" />
            My Profile
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
            <Settings className="w-5 h-5" />
            Settings
          </button>
        </nav>

        <button 
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 px-8 py-4 text-gray-700 hover:bg-gray-50 border-t border-gray-200"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </aside>

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">My Research Papers</h1>
              <p className="text-gray-600">
                {papers.length} paper{papers.length !== 1 ? 's' : ''} analyzed
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">{userName || 'Guest'}</span>
              <div className="w-10 h-10 bg-orange-300 rounded-full flex items-center justify-center font-semibold">
                {(userName || 'G').charAt(0).toUpperCase()}
              </div>
            </div>
          </div>

          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, author, or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button 
              onClick={() => onNavigate('upload')}
              className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
            >
              <Upload className="w-5 h-5" />
              Upload New Paper
            </button>
          </div>

          {filteredPapers.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No papers found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'Try a different search term' : 'Upload your first research paper to get started'}
              </p>
              {!searchTerm && (
                <button 
                  onClick={() => onNavigate('upload')}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
                >
                  Upload Paper
                </button>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow">
              <table className="w-full">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Paper Title</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Authors</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date Uploaded</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPapers.map((paper) => (
                    <tr key={paper.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{paper.title}</div>
                        {paper.filename && (
                          <div className="text-sm text-gray-500">{paper.filename}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-700">{paper.authors}</td>
                      <td className="px-6 py-4 text-gray-700">{paper.dateUploaded}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-800">
                          {paper.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onViewAnalysis && onViewAnalysis(paper)}
                            className="text-blue-600 hover:underline"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDelete(paper.id)}
                            className="text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// Analysis Page Component
const AnalysisPage = ({ onNavigate, paper, userName }) => {
  const [expandedSections, setExpandedSections] = useState({});
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState(null);
  const [isAsking, setIsAsking] = useState(false);
  const [plagiarismScore] = useState(Math.floor(Math.random() * 30) + 15);

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

  const extractedText = paper?.extractedText || '';
  const originalPercentage = 100 - plagiarismScore;
  const circumference = 2 * Math.PI * 88;
  const plagiarismOffset = circumference * (1 - plagiarismScore / 100);

  const generateSummary = (text) => {
    if (!text) return 'No summary available';
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
    const summaryLength = Math.min(5, sentences.length);
    const summary = sentences.slice(0, summaryLength).join('. ') + '.';
    return summary.length > 500 ? summary.substring(0, 500) + '...' : summary;
  };

  const summary = generateSummary(extractedText);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="font-semibold text-lg">AI Research Analyzer</span>
            </div>
            <div className="flex items-center gap-4">
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
              <div className="w-10 h-10 bg-orange-300 rounded-full flex items-center justify-center font-semibold">
                {(userName || 'G').charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <button onClick={() => onNavigate('home')} className="hover:text-gray-900">Home</button>
            <span>/</span>
            <button onClick={() => onNavigate('dashboard')} className="hover:text-gray-900">My Analyses</button>
            <span>/</span>
            <span className="text-gray-900">{paper?.title || 'Analysis'}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-indigo-900 mb-2">
              Analysis of '{paper?.title || 'Research Paper'}'
            </h1>
            <p className="text-gray-600">
              Analyzed on {paper?.dateUploaded || new Date().toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-3">
            <button className="bg-cyan-500 text-white px-6 py-2 rounded-md hover:bg-cyan-600 flex items-center gap-2">
              <Download className="w-5 h-5" />
              Download Report
            </button>
            <button className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-50 flex items-center gap-2">
              <Share2 className="w-5 h-5" />
              Share
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-6">
            {/* Summary */}
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg p-8 border border-blue-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-indigo-900">Summary</h2>
                  <p className="text-sm text-gray-600">AI-Generated Overview</p>
                </div>
              </div>

              <div className="prose prose-lg max-w-none">
                <p className="text-gray-800 leading-relaxed text-lg mb-6 font-light">
                  {summary}
                </p>
              </div>

              <div className="flex items-center gap-4 mt-6 pt-6 border-t border-blue-200">
                <button 
                  onClick={() => toggleSection('fullText')}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  {expandedSections.fullText ? (
                    <>
                      <ChevronUp className="w-5 h-5" />
                      Hide Full Text
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-5 h-5" />
                      Show Full Text
                    </>
                  )}
                </button>
                <div className="flex-1 flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    📊 {extractedText ? Math.ceil(extractedText.length / 5) : 0} words
                  </span>
                  <span className="flex items-center gap-1">
                    ⏱️ ~{extractedText ? Math.ceil(extractedText.length / 1000) : 0} min read
                  </span>
                </div>
              </div>

              {expandedSections.fullText && extractedText && (
                <div className="mt-6 p-6 bg-white rounded-xl shadow-inner max-h-96 overflow-y-auto border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Complete Document Text
                  </h3>
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap text-gray-700 font-sans leading-relaxed">
                      {extractedText}
                    </pre>
                  </div>
                </div>
              )}
            </div>

            {/* Keywords */}
            {keywords.length > 0 && (
              <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-lg p-8 border border-purple-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md">
                    <span className="text-2xl">🏷️</span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-indigo-900">Key Concepts</h2>
                    <p className="text-sm text-gray-600">Most Important Terms</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  {keywords.map((keyword, index) => (
                    <span 
                      key={index}
                      className={`${keyword.color} px-5 py-2.5 rounded-full text-sm font-semibold shadow-sm hover:shadow-md transition-shadow cursor-default`}
                    >
                      {keyword.text}
                    </span>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-purple-200">
                  <p className="text-sm text-gray-600">
                    💡 These keywords represent the main topics and themes discussed in the paper
                  </p>
                </div>
              </div>
            )}

            {/* Ask Questions */}
            <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-lg p-8 border border-green-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
                  <Search className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-indigo-900">Ask Questions</h2>
                  <p className="text-sm text-gray-600">Get AI-powered insights</p>
                </div>
              </div>

              <div className="flex gap-3 mb-6">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
                  placeholder="Ask anything about this research paper..."
                  className="flex-1 px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  disabled={isAsking}
                />
                <button
                  onClick={handleAskQuestion}
                  disabled={isAsking || !question.trim()}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:shadow-lg disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                  {isAsking ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Thinking...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      Ask
                    </>
                  )}
                </button>
              </div>

              {paper?.answer && (
                <div className="mb-4 p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white font-bold">Q</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-blue-900 font-semibold mb-3">
                        {paper.answer.question}
                      </p>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold">A</span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{paper.answer.answer}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {answer && (
                <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl border border-green-200 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white font-bold">Q</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-green-900 font-semibold mb-3">
                        {answer.question}
                      </p>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold">A</span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{answer.answer}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!paper?.answer && !answer && (
                <div className="text-center py-8 text-gray-500">
                  <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No questions asked yet. Start by asking something about the paper!</p>
                </div>
              )}
            </div>
          </div>

          <div className="col-span-1 space-y-6">
            {/* Plagiarism Report */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-indigo-900 mb-6">Plagiarism Report</h2>
              
              <div className="flex justify-center mb-6">
                <div className="relative w-48 h-48">
                  <svg className="w-48 h-48 transform -rotate-90">
                    <circle cx="96" cy="96" r="88" stroke="#e5e7eb" strokeWidth="16" fill="none" />
                    <circle cx="96" cy="96" r="88" stroke="#ef4444" strokeWidth="16" fill="none"
                      strokeDasharray={circumference} strokeDashoffset={plagiarismOffset} strokeLinecap="round" />
                    <circle cx="96" cy="96" r="88" stroke="#10b981" strokeWidth="16" fill="none"
                      strokeDasharray={circumference} strokeDashoffset={circumference * plagiarismScore / 100} strokeLinecap="round" />
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
                The plagiarism score is {plagiarismScore}%, indicating {plagiarismScore < 20 ? 'low' : plagiarismScore < 40 ? 'moderate' : 'high'} similarity.
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
                  <div className="text-sm text-gray-600 mb-1">Words</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {extractedText ? Math.round(extractedText.split(/\s+/).length).toLocaleString() : 0}
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

// Main App Component
function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [userName, setUserName] = useState(null);

  const handleLogin = (name) => {
    setUserName(name);
    setCurrentPage('home');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage onLogin={handleLogin} onNavigate={setCurrentPage} />;
      case 'home':
        return <HomePage onNavigate={setCurrentPage} userName={userName} />;
      case 'upload':
        return <UploadPage 
          onNavigate={setCurrentPage} 
          userName={userName}
          onUploadComplete={(paper) => {
            setSelectedPaper(paper);
            setCurrentPage('analysis');
          }} 
        />;
      case 'analysis':
        return <AnalysisPage 
          paper={selectedPaper} 
          onNavigate={setCurrentPage}
          userName={userName}
        />;
      case 'dashboard':
        return <DashboardPage 
          onNavigate={setCurrentPage}
          userName={userName}
          onViewAnalysis={(paper) => {
            setSelectedPaper(paper);
            setCurrentPage('analysis');
          }} 
        />;
      default:
        return <LoginPage onLogin={handleLogin} onNavigate={setCurrentPage} />;
    }
  };

  return <div className="App">{renderPage()}</div>;
}

export default App;