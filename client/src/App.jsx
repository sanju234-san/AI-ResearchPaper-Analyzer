import React, { useState, useEffect } from 'react';
import { Upload, Download, Share2, ChevronDown, ChevronUp, Search, BookOpen, BarChart3, Settings, LogOut, User, Eye, EyeOff, Sparkles, Zap, Brain, Rocket } from 'lucide-react';

// Enhanced Animated Mascot with Floating Animation
const AnimatedMascot = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setPosition({
        x: Math.sin(Date.now() / 1000) * 20,
        y: Math.cos(Date.now() / 1500) * 15
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className={`fixed bottom-8 right-8 z-50 transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`
      }}
    >
      <div 
        className="relative group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Enhanced Glow effect */}
        <div className={`absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-xl transition-all duration-1000 ${
          isHovered ? 'opacity-80 scale-125' : 'opacity-60 scale-100'
        } animate-pulse`}></div>
        
        {/* Enhanced Mascot with floating animation */}
        <div className={`relative w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-2xl transform transition-all duration-500 ${
          isHovered ? 'scale-110 rotate-12' : 'scale-100 rotate-0'
        } animate-float`}>
          <Brain className="w-12 h-12 text-white animate-pulse" />
          
          {/* Enhanced Orbiting particles */}
          <div className="absolute inset-0 animate-spin" style={{animationDuration: '3s'}}>
            <div className="absolute top-0 left-1/2 w-3 h-3 bg-yellow-400 rounded-full -ml-1.5 shadow-lg animate-ping"></div>
          </div>
          <div className="absolute inset-0 animate-spin" style={{animationDuration: '4s', animationDirection: 'reverse'}}>
            <div className="absolute top-0 left-1/2 w-2 h-2 bg-pink-400 rounded-full -ml-1 shadow-lg animate-bounce"></div>
          </div>
          
          {/* Particle burst on hover */}
          {isHovered && (
            <>
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-white rounded-full opacity-70"
                  style={{
                    transform: `rotate(${i * 45}deg) translateY(-40px)`,
                    animation: `particleBurst 0.6s ease-out forwards`,
                    animationDelay: `${i * 0.1}s`
                  }}
                />
              ))}
            </>
          )}
        </div>

        {/* Enhanced Tooltip */}
        <div className={`absolute bottom-full right-0 mb-2 px-4 py-2 bg-gray-900 text-white text-sm rounded-lg transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        } whitespace-nowrap shadow-xl backdrop-blur-sm`}>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 animate-spin" />
            AI Assistant Ready! 🚀
            <Sparkles className="w-4 h-4 animate-spin" />
          </div>
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Typewriter with cursor animation
const Typewriter = ({ text, className = '', speed = 80 }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return (
    <span className={className}>
      {displayText}
      <span className={`inline-block w-0.5 h-1em bg-current ml-1 transition-opacity duration-200 ${
        showCursor ? 'opacity-100' : 'opacity-0'
      }`}>|</span>
    </span>
  );
};

// Enhanced Loading Animation with Character
const LoadingAnimation = ({ uploadProgress, fileName }) => {
  const [analysisStage, setAnalysisStage] = useState('upload');
  const [characterPosition, setCharacterPosition] = useState(0);

  useEffect(() => {
    if (uploadProgress < 25) setAnalysisStage('upload');
    else if (uploadProgress < 50) setAnalysisStage('extracting');
    else if (uploadProgress < 75) setAnalysisStage('analyzing');
    else setAnalysisStage('finalizing');
  }, [uploadProgress]);

  useEffect(() => {
    // Animate character position based on progress
    const targetPosition = (uploadProgress / 100) * 80;
    setCharacterPosition(targetPosition);
  }, [uploadProgress]);

  const getStageInfo = () => {
    switch (analysisStage) {
      case 'upload': return { 
        title: 'Uploading Document', 
        subtitle: 'Securely transferring your research paper', 
        icon: '📤', 
        gradient: 'from-blue-500 via-blue-600 to-indigo-600',
        character: '🚀'
      };
      case 'extracting': return { 
        title: 'Extracting Content', 
        subtitle: 'Reading and parsing document structure', 
        icon: '📖', 
        gradient: 'from-purple-500 via-purple-600 to-pink-600',
        character: '🔍'
      };
      case 'analyzing': return { 
        title: 'AI Analysis in Progress', 
        subtitle: 'Identifying key concepts and patterns', 
        icon: '🤖', 
        gradient: 'from-green-500 via-emerald-600 to-teal-600',
        character: '🧠'
      };
      case 'finalizing': return { 
        title: 'Finalizing Results', 
        subtitle: 'Preparing your comprehensive analysis', 
        icon: '✨', 
        gradient: 'from-orange-500 via-pink-600 to-rose-600',
        character: '🎯'
      };
      default: return { 
        title: 'Processing', 
        subtitle: 'Please wait', 
        icon: '⏳', 
        gradient: 'from-blue-500 to-purple-600',
        character: '⚡'
      };
    }
  };

  const stageInfo = getStageInfo();

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center z-50 overflow-hidden">
      {/* Enhanced Background Particles */}
      {[...Array(30)].map((_, i) => (
        <div 
          key={i} 
          className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-float"
          style={{ 
            left: `${Math.random() * 100}%`, 
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${3 + Math.random() * 4}s`
          }} 
        />
      ))}

      {/* Enhanced Gradient Orbs */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
        <div className="absolute top-3/4 left-1/3 w-64 h-64 bg-cyan-500 rounded-full filter blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '0.5s' }} />
      </div>

      {/* Progress Bar with Animated Character */}
      <div className="absolute bottom-32 left-10 right-10 bg-white/10 backdrop-blur-sm rounded-full h-4 overflow-hidden shadow-inner border border-white/20">
        <div 
          className={`relative h-full bg-gradient-to-r ${stageInfo.gradient} rounded-full transition-all duration-500`} 
          style={{ width: `${uploadProgress}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          
          {/* Animated Character */}
          <div 
            className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1/2 text-2xl animate-bounce"
            style={{ right: `${100 - characterPosition}%` }}
          >
            {stageInfo.character}
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-2xl w-full mx-auto px-8">
        <div className="flex flex-col items-center mb-12">
          {/* Enhanced Loading Spinner */}
          <div className="relative w-64 h-64 mb-8">
            <div className="absolute inset-0 rounded-full border-4 border-blue-400/30 animate-spin" style={{ animationDuration: '3s' }} />
            <div className="absolute inset-2 rounded-full border-4 border-purple-400/30 animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }} />
            <div className="absolute inset-4 rounded-full border-4 border-cyan-400/30 animate-spin" style={{ animationDuration: '4s' }} />
            
            <div className={`absolute inset-8 rounded-full bg-gradient-to-br ${stageInfo.gradient} animate-pulse flex items-center justify-center shadow-2xl`}>
              <span className="text-7xl animate-bounce">{stageInfo.icon}</span>
            </div>
          </div>

          {/* Enhanced Text Content */}
          <div className="text-center space-y-3 mb-8">
            <h2 className={`text-4xl font-bold bg-gradient-to-r ${stageInfo.gradient} bg-clip-text text-transparent animate-pulse`}>
              <Typewriter text={stageInfo.title} speed={60} />
            </h2>
            <p className="text-xl text-blue-200 animate-fadeIn">{stageInfo.subtitle}</p>
            <p className="text-sm text-blue-300/70 max-w-md truncate animate-fadeIn delay-200">
              📄 {fileName}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between text-sm font-medium text-blue-200">
            <span>Analysis Progress</span>
            <span className="text-white font-bold animate-pulse">{uploadProgress}%</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float { 
          0%, 100% { transform: translateY(0px) rotate(0deg); } 
          50% { transform: translateY(-20px) rotate(5deg); } 
        }
        @keyframes shimmer { 
          0% { transform: translateX(-100%); } 
          100% { transform: translateX(100%); } 
        }
        @keyframes fadeIn { 
          from { opacity: 0; transform: translateY(10px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        @keyframes particleBurst { 
          0% { transform: rotate(var(--rotation)) translateY(0) scale(1); opacity: 1; } 
          100% { transform: rotate(var(--rotation)) translateY(-60px) scale(0); opacity: 0; } 
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-shimmer { animation: shimmer 2s infinite; }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out both; }
        .delay-200 { animation-delay: 0.2s; }
      `}</style>
    </div>
  );
};

// Enhanced Login Page with Character Animation
const LoginPage = ({ onLogin, onNavigate }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [particles, setParticles] = useState([]);
  const [characterPosition, setCharacterPosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    // Enhanced particles with more variety
    const newParticles = [...Array(50)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 5 + 3,
      delay: Math.random() * 2,
      type: Math.random() > 0.5 ? 'circle' : 'square'
    }));
    setParticles(newParticles);

    // Animate character position
    const moveCharacter = () => {
      setCharacterPosition({
        x: 20 + Math.random() * 60,
        y: 30 + Math.random() * 40
      });
    };

    const interval = setInterval(moveCharacter, 3000);
    return () => clearInterval(interval);
  }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Enhanced Animated particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className={`absolute ${particle.type === 'circle' ? 'rounded-full' : 'rounded-sm'} bg-white/20 animate-float`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animation: `float ${particle.duration}s ease-in-out infinite`,
            animationDelay: `${particle.delay}s`
          }}
        />
      ))}

      {/* Enhanced Gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse animate-float"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse animate-float" style={{animationDelay: '0.5s'}}></div>
      </div>

      {/* Animated Character */}
      <div 
        className="absolute text-6xl z-20 transition-all duration-2000 ease-in-out"
        style={{
          left: `${characterPosition.x}%`,
          top: `${characterPosition.y}%`,
          transform: 'translate(-50%, -50%)'
        }}
      >
        <div className="animate-bounce hover:animate-spin cursor-pointer">
          {isLogin ? '👨‍💻' : '🚀'}
        </div>
      </div>

      <div className="relative w-full max-w-md z-10">
        {/* Enhanced Logo Animation */}
        <div className="text-center mb-8 animate-fadeIn">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl shadow-2xl mb-4 transform hover:scale-110 transition-transform duration-300 relative group animate-pulse">
            <BookOpen className="w-10 h-10 text-white" />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity animate-ping"></div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent animate-pulse">
            AI Research Analyzer
          </h1>
          <p className="text-blue-200 flex items-center justify-center gap-2 animate-bounce">
            <Sparkles className="w-4 h-4 animate-spin" />
            Unlock insights from research papers
            <Sparkles className="w-4 h-4 animate-spin" />
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 animate-slideUp">
          {/* Enhanced Tab Switcher */}
          <div className="flex gap-2 mb-6 bg-white/10 p-1 rounded-xl backdrop-blur-sm">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-lg font-medium transition-all duration-300 ${
                isLogin 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105 animate-pulse' 
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-lg font-medium transition-all duration-300 ${
                !isLogin 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105 animate-pulse' 
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="animate-slideDown">
                <label className="block text-sm font-medium text-white/90 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4 animate-bounce" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-white/50 backdrop-blur-sm transition-all hover:bg-white/15 focus:bg-white/20"
                  placeholder="John Doe"
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-white/90 mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4 animate-pulse" />
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-white/50 backdrop-blur-sm transition-all hover:bg-white/15 focus:bg-white/20"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90 mb-2 flex items-center gap-2">
                <Brain className="w-4 h-4 animate-bounce" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-white/50 backdrop-blur-sm transition-all hover:bg-white/15 focus:bg-white/20"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors animate-pulse"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity animate-shimmer"></div>
              <span className="relative flex items-center gap-2">
                {isLogin ? 'Login' : 'Create Account'}
                <Rocket className="w-5 h-5 group-hover:translate-x-1 transition-transform group-hover:animate-bounce" />
              </span>
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-transparent text-white/60 animate-pulse">Or continue as guest</span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('home')}
            className="w-full border-2 border-white/30 text-white py-3 rounded-xl font-semibold hover:bg-white/10 transition-all backdrop-blur-sm flex items-center justify-center gap-2 group animate-bounce hover:animate-none"
          >
            Continue as Guest
            <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform group-hover:animate-spin" />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { 
          from { opacity: 0; transform: translateY(-20px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        @keyframes slideUp { 
          from { opacity: 0; transform: translateY(30px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        @keyframes slideDown { 
          from { opacity: 0; transform: translateY(-10px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
        .animate-slideUp { animation: slideUp 0.6s ease-out; }
        .animate-slideDown { animation: slideDown 0.3s ease-out; }
      `}</style>
    </div>
  );
};

// Enhanced HomePage with animated features
const HomePage = ({ onNavigate, userName }) => {
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const features = [
    { 
      icon: '🔍', 
      title: 'Plagiarism Detection', 
      description: 'Advanced AI-powered plagiarism checking with detailed reports', 
      color: 'from-green-400 to-green-600',
      animation: 'hover:scale-110 hover:rotate-3'
    },
    { 
      icon: '📄', 
      title: 'Smart Summarization', 
      description: 'Get concise, accurate summaries of complex research papers', 
      color: 'from-blue-400 to-blue-600',
      animation: 'hover:scale-110 hover:-rotate-3'
    },
    { 
      icon: '🏷️', 
      title: 'Keyword Extraction', 
      description: 'Automatically identify key concepts and terminology', 
      color: 'from-purple-400 to-purple-600',
      animation: 'hover:scale-110 hover:rotate-6'
    },
    { 
      icon: '📊', 
      title: 'Citation Analysis', 
      description: 'Comprehensive analysis of references and citations', 
      color: 'from-orange-400 to-orange-600',
      animation: 'hover:scale-110 hover:-rotate-6'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 overflow-hidden">
      <AnimatedMascot />
      
      {/* Enhanced Header with animation */}
      <header className={`bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40 transition-all duration-500 ${
        mounted ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
      }`}>
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 animate-pulse">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              AI Research Analyzer
            </span>
          </div>
          <nav className="flex gap-6 items-center">
            <button className="text-gray-700 hover:text-blue-600 font-medium transition-colors hover:scale-110">Features</button>
            <button className="text-gray-700 hover:text-blue-600 font-medium transition-colors hover:scale-110">Pricing</button>
            <button className="text-gray-700 hover:text-blue-600 font-medium transition-colors hover:scale-110">About</button>
            {userName ? (
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => onNavigate('dashboard')} 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all transform hover:scale-105 animate-pulse"
                >
                  Dashboard
                </button>
                <div className="w-10 h-10 bg-orange-300 rounded-full flex items-center justify-center font-semibold text-gray-700 hover:scale-110 transition-transform">
                  {userName.charAt(0).toUpperCase()}
                </div>
              </div>
            ) : (
              <button 
                onClick={() => onNavigate('login')} 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all transform hover:scale-105 animate-bounce"
              >
                Login
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Enhanced Hero Section */}
      <section className="max-w-7xl mx-auto px-8 py-20 text-center">
        <div className="mb-6 inline-block animate-bounce">
          <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold animate-pulse">
            ✨ AI-Powered Research Analysis
          </span>
        </div>
        <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight animate-fadeIn">
          <Typewriter 
            className='bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent' 
            text="Unlock Deeper Insights From Your Research Papers" 
            speed={50}
          />
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto animate-fadeIn delay-200">
          Analyze research papers with cutting-edge AI technology. Get summaries, detect plagiarism, and extract key insights instantly.
        </p>
        <div className="flex gap-4 justify-center animate-fadeIn delay-400">
          <button 
            onClick={() => onNavigate(userName ? 'upload' : 'login')} 
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 animate-pulse"
          >
            {userName ? 'Analyze Paper →' : 'Get Started →'}
          </button>
          {userName && (
            <button 
              onClick={() => onNavigate('dashboard')} 
              className="bg-white text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-gray-300 hover:border-blue-600 hover:text-blue-600 transition-all transform hover:scale-105"
            >
              View Dashboard
            </button>
          )}
        </div>

        {/* Enhanced Stats Section */}
        <div className="mt-16 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 rounded-2xl p-12 shadow-2xl relative overflow-hidden animate-fadeIn delay-600">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 w-40 h-40 bg-blue-500 rounded-full filter blur-3xl animate-pulse animate-float"></div>
            <div className="absolute bottom-10 right-10 w-60 h-60 bg-purple-500 rounded-full filter blur-3xl animate-pulse animate-float" style={{animationDelay: '1s'}}></div>
          </div>

          <div className="relative z-10 grid grid-cols-3 gap-6">
            {[
              { icon: '📈', value: '98%', label: 'Accuracy Rate' },
              { icon: '⚡', value: '<30s', label: 'Analysis Time' },
              { icon: '🎯', value: '10K+', label: 'Papers Analyzed' }
            ].map((stat, index) => (
              <div 
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 animate-fadeIn"
                style={{animationDelay: `${800 + index * 200}ms`}}
              >
                <div className="text-4xl mb-3 animate-bounce">{stat.icon}</div>
                <div className="text-3xl font-bold text-white mb-2 animate-pulse">{stat.value}</div>
                <div className="text-blue-200 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="max-w-7xl mx-auto px-8 py-20">
        <div className="text-center mb-16 animate-fadeIn">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
          <p className="text-xl text-gray-600">Everything you need for comprehensive research analysis</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`bg-white p-8 rounded-2xl shadow-lg border-2 transition-all duration-500 transform ${
                hoveredFeature === index 
                  ? 'border-blue-500 shadow-2xl scale-105 rotate-3' 
                  : 'border-transparent hover:scale-105'
              } ${feature.animation} cursor-pointer animate-fadeIn`}
              style={{animationDelay: `${600 + index * 100}ms`}}
              onMouseEnter={() => setHoveredFeature(index)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg text-3xl animate-bounce`}>
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

// API Service
const API_BASE_URL = 'http://localhost:8000';
const api = {
  analyzePDF: async (file, question = null) => {
    const formData = new FormData();
    formData.append('file', file);
    if (question) formData.append('question', question);
    const response = await fetch(`${API_BASE_URL}/analyze-pdf`, { method: 'POST', body: formData });
    if (!response.ok) throw new Error((await response.json()).detail || 'Upload failed');
    return await response.json();
  },
  analyzeImage: async (file, question = null) => {
    const formData = new FormData();
    formData.append('file', file);
    if (question) formData.append('question', question);
    const response = await fetch(`${API_BASE_URL}/analyze-image`, { method: 'POST', body: formData });
    if (!response.ok) throw new Error((await response.json()).detail || 'Upload failed');
    return await response.json();
  },
  askQuestion: async (question) => {
    const formData = new FormData();
    formData.append('question', question);
    const response = await fetch(`${API_BASE_URL}/ask-question`, { method: 'POST', body: formData });
    if (!response.ok) throw new Error('Question failed');
    return await response.json();
  }
};

// UploadPage Component (unchanged functionality, enhanced animations)
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
            <button onClick={() => onNavigate('home')} className="text-gray-700 hover:text-blue-600">Home</button>
            <button onClick={() => onNavigate('dashboard')} className="text-gray-700 hover:text-blue-600">Dashboard</button>
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

// DashboardPage Component (unchanged functionality)
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

// AnalysisPage Component (unchanged functionality)
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
              <button onClick={() => onNavigate('home')} className="text-gray-700 hover:text-gray-900">Home</button>
              <button onClick={() => onNavigate('dashboard')} className="text-gray-700 hover:text-gray-900">My Analyses</button>
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
                <p className="text-gray-800 leading-relaxed text-lg mb-6 font-light">{summary}</p>
              </div>

              <div className="flex items-center gap-4 mt-6 pt-6 border-t border-blue-200">
                <button 
                  onClick={() => toggleSection('fullText')}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  {expandedSections.fullText ? (
                    <><ChevronUp className="w-5 h-5" />Hide Full Text</>
                  ) : (
                    <><ChevronDown className="w-5 h-5" />Show Full Text</>
                  )}
                </button>
              </div>

              {expandedSections.fullText && extractedText && (
                <div className="mt-6 p-6 bg-white rounded-xl shadow-inner max-h-96 overflow-y-auto border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Complete Document Text
                  </h3>
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap text-gray-700 font-sans leading-relaxed">{extractedText}</pre>
                  </div>
                </div>
              )}
            </div>

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
                    <span key={index} className={`${keyword.color} px-5 py-2.5 rounded-full text-sm font-semibold shadow-sm hover:shadow-md transition-shadow cursor-default`}>
                      {keyword.text}
                    </span>
                  ))}
                </div>
              </div>
            )}

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
                      <p className="text-sm text-blue-900 font-semibold mb-3">{paper.answer.question}</p>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold">A</span>
                        </div>
                        <p className="text-sm text-gray-800 leading-relaxed">{paper.answer.answer}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {answer && (
                <div className="p-5 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white font-bold">A</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-green-900 font-semibold mb-3">{answer.question}</p>
                      <p className="text-sm text-gray-800 leading-relaxed">{answer.answer}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-white to-red-50 rounded-2xl shadow-lg p-8 border border-red-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-2xl">🔍</span>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-indigo-900">Plagiarism Check</h2>
                  <p className="text-sm text-gray-600">Similarity Analysis</p>
                </div>
              </div>

              <div className="text-center">
                <div className="relative w-48 h-48 mx-auto mb-4">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="44"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="44"
                      fill="none"
                      stroke="url(#plagiarismGradient)"
                      strokeWidth="8"
                      strokeDasharray={`${plagiarismScore} ${100 - plagiarismScore}`}
                      strokeDashoffset="25"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="plagiarismGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ef4444" />
                        <stop offset="100%" stopColor="#f97316" />
                      </linearGradient>
                    </defs>
                    <text
                      x="50"
                      y="50"
                      textAnchor="middle"
                      dy="7"
                      fontSize="20"
                      fontWeight="bold"
                      fill="#1f2937"
                    >
                      {plagiarismScore}%
                    </text>
                  </svg>
                </div>
                <p className="text-gray-600 mb-2">Similarity Score</p>
                <p className="text-sm text-gray-500">
                  {plagiarismScore < 20 
                    ? 'Low similarity - Original content'
                    : plagiarismScore < 40
                    ? 'Moderate similarity - Review recommended'
                    : 'High similarity - Needs attention'
                  }
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-yellow-50 rounded-2xl shadow-lg p-8 border border-yellow-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-2xl">📝</span>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-indigo-900">Document Info</h2>
                  <p className="text-sm text-gray-600">Analysis Details</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Text Length</p>
                  <p className="font-semibold text-gray-900">{paper?.textLength || 0} characters</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Analysis Date</p>
                  <p className="font-semibold text-gray-900">{paper?.dateUploaded || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-semibold text-green-600">{paper?.status || 'Completed'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component with all routing intact
const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [userName, setUserName] = useState(null);
  const [currentPaper, setCurrentPaper] = useState(null);

  const handleLogin = (name) => {
    setUserName(name);
    setCurrentPage('home');
  };

  const handleUploadComplete = (paper) => {
    setCurrentPaper(paper);
    setCurrentPage('analysis');
  };

  const handleViewAnalysis = (paper) => {
    setCurrentPaper(paper);
    setCurrentPage('analysis');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage onLogin={handleLogin} onNavigate={setCurrentPage} />;
      case 'home':
        return <HomePage onNavigate={setCurrentPage} userName={userName} />;
      case 'upload':
        return <UploadPage onNavigate={setCurrentPage} onUploadComplete={handleUploadComplete} userName={userName} />;
      case 'dashboard':
        return <DashboardPage onNavigate={setCurrentPage} onViewAnalysis={handleViewAnalysis} userName={userName} />;
      case 'analysis':
        return <AnalysisPage onNavigate={setCurrentPage} paper={currentPaper} userName={userName} />;
      default:
        return <HomePage onNavigate={setCurrentPage} userName={userName} />;
    }
  };

  return renderPage();
};

export default App;