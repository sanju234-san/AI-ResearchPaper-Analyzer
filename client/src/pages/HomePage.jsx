import React from 'react';

const HomePage = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xl">
              📊
            </div>
            <span className="text-xl font-semibold text-gray-800">AI Research Analyzer</span>
          </div>
          <nav className="flex gap-8">
            <button onClick={() => onNavigate('home')} className="text-gray-700 hover:text-gray-900">Home</button>
            <button className="text-gray-700 hover:text-gray-900">Features</button>
            <button className="text-gray-700 hover:text-gray-900">Pricing</button>
            <button className="text-gray-700 hover:text-gray-900">About</button>
            <button onClick={() => onNavigate('upload')} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              Analyze My Paper
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-8 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Unlock Deeper Insights from Your Research
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Our AI-powered tool analyzes your research papers for plagiarism, summarization, and more.
        </p>
        <button 
          onClick={() => onNavigate('upload')}
          className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700"
        >
          Analyze My Paper
        </button>

        {/* Decorative Background */}
        <div className="mt-16 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-16 shadow-2xl">
          <div className="relative h-80">
            {/* Wave pattern simulation */}
            <div className="absolute inset-0 opacity-30">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(90deg, transparent, rgba(59, 130, 246, ${0.3 - i * 0.015}), transparent)`,
                    transform: `translateY(${i * 20}px) scaleX(${1 - i * 0.02})`,
                    height: '2px'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="max-w-7xl mx-auto px-8 py-20">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">Key Features</h2>
        <p className="text-center text-gray-600 mb-16">
          Our powerful AI tools provide in-depth analysis of your research papers.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Feature 1 */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Plagiarism Detection</h3>
            <p className="text-gray-600">
              Ensure the originality of your work with our advanced plagiarism checker.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Automated Summarization</h3>
            <p className="text-gray-600">
              Get a concise summary of your research paper in seconds.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Keyword Extraction</h3>
            <p className="text-gray-600">
              Identify the most important keywords and concepts in your paper.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Citation Analysis</h3>
            <p className="text-gray-600">
              Analyze your citations and references for accuracy and completeness.
            </p>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="max-w-7xl mx-auto px-8 py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-12">Trusted by researchers from</h2>
        <div className="flex justify-center gap-16 items-center opacity-60">
          <div className="w-24 h-24 bg-gray-300 rounded-lg"></div>
          <div className="w-24 h-24 bg-gray-300 rounded-lg"></div>
          <div className="w-24 h-24 bg-gray-300 rounded-lg"></div>
          <div className="w-24 h-24 bg-gray-300 rounded-lg"></div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="grid grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">SOLUTIONS</h3>
              <ul className="space-y-2 text-gray-600">
                <li>Plagiarism</li>
                <li>Summarization</li>
                <li>Keyword Extraction</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">SUPPORT</h3>
              <ul className="space-y-2 text-gray-600">
                <li>Pricing</li>
                <li>Documentation</li>
                <li>Guides</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">COMPANY</h3>
              <ul className="space-y-2 text-gray-600">
                <li>About</li>
                <li>Blog</li>
                <li>Jobs</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">LEGAL</h3>
              <ul className="space-y-2 text-gray-600">
                <li>Claim</li>
                <li>Privacy</li>
                <li>Terms</li>
              </ul>
            </div>
          </div>
          <div className="flex justify-between items-center pt-8 border-t border-gray-200">
            <p className="text-gray-600">© 2023 AI Research Analyzer. All rights reserved.</p>
            <div className="flex gap-4">
              <button className="text-gray-600 hover:text-gray-900">Facebook</button>
              <button className="text-gray-600 hover:text-gray-900">Twitter</button>
              <button className="text-gray-600 hover:text-gray-900">LinkedIn</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;