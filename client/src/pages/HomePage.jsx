// client/src/pages/HomePage.jsx
import React, { useState } from 'react';

const HomePage = ({ onNavigate }) => {
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [hoveredUniversity, setHoveredUniversity] = useState(null);

  const universities = [
    { name: 'Stanford', color: 'from-red-500 to-red-600', icon: '🎓' },
    { name: 'MIT', color: 'from-blue-500 to-blue-600', icon: '🔬' },
    { name: 'Harvard', color: 'from-purple-500 to-purple-600', icon: '📚' },
    { name: 'Oxford', color: 'from-indigo-500 to-indigo-600', icon: '🏛️' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white text-xl shadow-lg">
              📊
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              AI Research Analyzer
            </span>
          </div>
          <nav className="flex gap-8 items-center">
            <button onClick={() => onNavigate('home')} className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Home</button>
            <button className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Features</button>
            <button className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Pricing</button>
            <button className="text-gray-700 hover:text-blue-600 font-medium transition-colors">About</button>
            <button 
              onClick={() => onNavigate('upload')} 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-medium"
            >
              Analyze My Paper
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-8 py-20 text-center">
        <div className="mb-6 inline-block">
          <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
            ✨ AI-Powered Research Analysis
          </span>
        </div>
        <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Unlock Deeper Insights from<br/>
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Your Research
          </span>
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Our AI-powered tool analyzes your research papers for plagiarism, summarization, and more with cutting-edge technology.
        </p>
        <div className="flex gap-4 justify-center mb-8">
          <button 
            onClick={() => onNavigate('upload')}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            Analyze My Paper →
          </button>
          <button className="bg-white text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-gray-300 hover:border-blue-600 hover:text-blue-600 transition-all duration-300">
            Watch Demo
          </button>
        </div>

        {/* Interactive Visualization Dashboard */}
        <div className="mt-16 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 rounded-2xl p-12 shadow-2xl relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 w-40 h-40 bg-blue-500 rounded-full filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-60 h-60 bg-purple-500 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 w-50 h-50 bg-cyan-500 rounded-full filter blur-3xl animate-pulse delay-500"></div>
          </div>

          {/* Dashboard Content */}
          <div className="relative z-10 grid grid-cols-3 gap-6">
            {/* Stats Card 1 */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <div className="text-4xl mb-3">📈</div>
              <div className="text-3xl font-bold text-white mb-2">98%</div>
              <div className="text-blue-200 text-sm">Accuracy Rate</div>
            </div>

            {/* Stats Card 2 */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <div className="text-4xl mb-3">⚡</div>
              <div className="text-3xl font-bold text-white mb-2">&lt;30s</div>
              <div className="text-blue-200 text-sm">Analysis Time</div>
            </div>

            {/* Stats Card 3 */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <div className="text-4xl mb-3">🎯</div>
              <div className="text-3xl font-bold text-white mb-2">10K+</div>
              <div className="text-blue-200 text-sm">Papers Analyzed</div>
            </div>
          </div>

          {/* Waveform Visualization */}
          <div className="mt-8 h-32 flex items-end justify-center gap-2">
            {[...Array(40)].map((_, i) => (
              <div
                key={i}
                className="w-2 bg-gradient-to-t from-blue-400 to-cyan-300 rounded-full animate-pulse"
                style={{
                  height: `${Math.random() * 100 + 20}%`,
                  animationDelay: `${i * 0.05}s`,
                  animationDuration: '1.5s'
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="max-w-7xl mx-auto px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Key Features</h2>
          <p className="text-xl text-gray-600">
            Powerful AI tools for comprehensive research paper analysis
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Feature 1 - Plagiarism Detection */}
          <div 
            className={`bg-white p-8 rounded-2xl shadow-lg border-2 ${hoveredFeature === 1 ? 'border-green-500 shadow-2xl' : 'border-transparent'} text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer`}
            onMouseEnter={() => setHoveredFeature(1)}
            onMouseLeave={() => setHoveredFeature(null)}
          >
            <div className={`w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg transform transition-transform duration-300 ${hoveredFeature === 1 ? 'scale-110 rotate-6' : ''}`}>
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Plagiarism Detection</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Ensure the originality of your work with our advanced plagiarism checker.
            </p>
          </div>

          {/* Feature 2 - Automated Summarization */}
          <div 
            className={`bg-white p-8 rounded-2xl shadow-lg border-2 ${hoveredFeature === 2 ? 'border-blue-500 shadow-2xl' : 'border-transparent'} text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer`}
            onMouseEnter={() => setHoveredFeature(2)}
            onMouseLeave={() => setHoveredFeature(null)}
          >
            <div className={`w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg transform transition-transform duration-300 ${hoveredFeature === 2 ? 'scale-110 rotate-6' : ''}`}>
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Automated Summarization</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Get a concise summary of your research paper in seconds.
            </p>
          </div>

          {/* Feature 3 - Keyword Extraction */}
          <div 
            className={`bg-white p-8 rounded-2xl shadow-lg border-2 ${hoveredFeature === 3 ? 'border-purple-500 shadow-2xl' : 'border-transparent'} text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer`}
            onMouseEnter={() => setHoveredFeature(3)}
            onMouseLeave={() => setHoveredFeature(null)}
          >
            <div className={`w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg transform transition-transform duration-300 ${hoveredFeature === 3 ? 'scale-110 rotate-6' : ''}`}>
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Keyword Extraction</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Identify the most important keywords and concepts in your paper.
            </p>
          </div>

          {/* Feature 4 - Citation Analysis */}
          <div 
            className={`bg-white p-8 rounded-2xl shadow-lg border-2 ${hoveredFeature === 4 ? 'border-orange-500 shadow-2xl' : 'border-transparent'} text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer`}
            onMouseEnter={() => setHoveredFeature(4)}
            onMouseLeave={() => setHoveredFeature(null)}
          >
            <div className={`w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg transform transition-transform duration-300 ${hoveredFeature === 4 ? 'scale-110 rotate-6' : ''}`}>
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Citation Analysis</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Analyze your citations and references for accuracy and completeness.
            </p>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="max-w-7xl mx-auto px-8 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Trusted by researchers from</h2>
        <div className="flex justify-center gap-8 items-center flex-wrap">
          {universities.map((uni, index) => (
            <div
              key={index}
              className={`relative group cursor-pointer transition-all duration-300 transform ${hoveredUniversity === index ? 'scale-110' : ''}`}
              onMouseEnter={() => setHoveredUniversity(index)}
              onMouseLeave={() => setHoveredUniversity(null)}
            >
              <div className={`w-32 h-32 bg-gradient-to-br ${uni.color} rounded-2xl flex flex-col items-center justify-center shadow-lg hover:shadow-2xl transition-all duration-300`}>
                <div className="text-4xl mb-2">{uni.icon}</div>
                <div className="text-white font-bold text-sm">{uni.name}</div>
              </div>
              {hoveredUniversity === index && (
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-1 rounded text-xs whitespace-nowrap">
                  {uni.name} University
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white mt-20">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="grid grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4 text-blue-400">COMPANY</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li><button className="hover:text-blue-400 transition-colors">About</button></li>
                <li><button className="hover:text-blue-400 transition-colors">Blog</button></li>
                <li><button className="hover:text-blue-400 transition-colors">Jobs</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4 text-blue-400">SOLUTIONS</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li><button className="hover:text-blue-400 transition-colors">Plagiarism</button></li>
                <li><button className="hover:text-blue-400 transition-colors">Summarization</button></li>
                <li><button className="hover:text-blue-400 transition-colors">Keyword Extraction</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4 text-blue-400">SUPPORT</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li><button className="hover:text-blue-400 transition-colors">Pricing</button></li>
                <li><button className="hover:text-blue-400 transition-colors">Documentation</button></li>
                <li><button className="hover:text-blue-400 transition-colors">Guides</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4 text-blue-400">LEGAL</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li><button className="hover:text-blue-400 transition-colors">Claim</button></li>
                <li><button className="hover:text-blue-400 transition-colors">Privacy</button></li>
                <li><button className="hover:text-blue-400 transition-colors">Terms</button></li>
              </ul>
            </div>
          </div>
          <div className="flex justify-between items-center pt-8 border-t border-gray-700">
            <p className="text-gray-400 text-sm">© 2023 AI Research Analyzer. All rights reserved.</p>
            <div className="flex gap-6">
              <button className="text-gray-400 hover:text-blue-400 transition-colors transform hover:scale-110">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
              <button className="text-gray-400 hover:text-blue-400 transition-colors transform hover:scale-110">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </button>
              <button className="text-gray-400 hover:text-blue-400 transition-colors transform hover:scale-110">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;