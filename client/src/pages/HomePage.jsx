import React, { useState, useEffect } from 'react';
import NavBar from '../Components/NavBar';
import TechBadge from '../Components/TechBadge';
import { Search, FileText, Tags, Bot } from 'lucide-react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { useRef } from 'react';

const TypewriterTitle = () => {
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const fullText = "Unlock Deeper Insights From Your Research Papers";
  
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) {
        clearInterval(timer);
        setIsTyping(false);
      }
    }, 50);
    return () => clearInterval(timer);
  }, []);

  const part1 = text.length > 22 ? text.slice(0, 22) : text;
  const part2 = text.length > 22 ? text.slice(23, 33) : '';
  const part3 = text.length > 33 ? text.slice(33) : '';

  return (
    <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-6 leading-tight min-h-[120px] md:min-h-[160px]">
      {part1}<br />
      {part2} <span className="text-mint text-glow-mint">{part3}</span>
      <span className={`inline-block w-1 md:w-1.5 h-10 md:h-16 ml-1 bg-mint translate-y-1 md:translate-y-2 ${isTyping ? '' : 'animate-pulse'}`}></span>
    </h1>
  );
};

const HomePage = ({ onNavigate, userName }) => {
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const features = [
    { icon: <Search className="w-6 h-6 text-mint" />, title: 'Plagiarism Detection', desc: 'AI-powered similarity checking with detailed reports', gradient: 'from-mint/20 to-mint/5', border: 'hover:border-mint/30' },
    { icon: <FileText className="w-6 h-6 text-amber" />, title: 'Smart Summarization', desc: 'AI-generated structured paper summaries', gradient: 'from-amber/20 to-amber/5', border: 'hover:border-amber/30' },
    { icon: <Tags className="w-6 h-6 text-purple" />, title: 'Keyword Extraction', desc: 'AI-powered domain-specific concept identification', gradient: 'from-purple/20 to-purple/5', border: 'hover:border-purple/30' },
    { icon: <Bot className="w-6 h-6 text-blue-400" />, title: 'RAG Q&A', desc: 'Ask questions grounded in your paper', gradient: 'from-blue-400/20 to-blue-400/5', border: 'hover:border-blue-400/30' },
  ];

  const stats = [
    { value: '98%', label: 'Accuracy' },
    { value: '<2s', label: 'Response Time' },
    { value: 'Advanced', label: 'AI Model' },
    { value: 'FAISS', label: 'Vector DB' },
  ];

  const AnimatedCounter = ({ value, label }) => {
    const isNumber = !isNaN(parseInt(value));
    const finalVal = parseInt(value) || 0;
    const suffix = value.toString().replace(/[0-9]/g, '');
    
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-100px" });

    useEffect(() => {
      if (inView && isNumber) {
        let startTime;
        const duration = 2000;
        
        const step = (timestamp) => {
          if (!startTime) startTime = timestamp;
          const progress = Math.min((timestamp - startTime) / duration, 1);
          setCount(Math.floor(progress * finalVal));
          if (progress < 1) {
            window.requestAnimationFrame(step);
          }
        };
        window.requestAnimationFrame(step);
      }
    }, [inView, isNumber, finalVal]);

    return (
      <div ref={ref}>
        <div className="text-2xl font-bold text-white font-mono">
          {isNumber ? count : value}{isNumber ? suffix : ''}
        </div>
        <div className="text-xs text-mint mt-1">{label}</div>
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-primary"
    >
      <NavBar onNavigate={onNavigate} userName={userName} />

      {/* Hero */}
      <section className="relative pt-28 pb-20 px-6 overflow-hidden noise-overlay">
        <div className="absolute inset-0">
          {[...Array(25)].map((_, i) => (
            <div key={i} className="absolute w-1 h-1 bg-mint/30 rounded-full particle"
              style={{ left: `${Math.random()*100}%`, top: `${Math.random()*100}%`, '--duration': `${5+Math.random()*5}s`, '--delay': `${Math.random()*4}s` }} />
          ))}
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-block mb-6">
            <span className="px-4 py-1.5 rounded-full text-xs font-mono bg-mint/10 text-mint border border-mint/20">
              ✨ Powered by AI
            </span>
          </div>

          <TypewriterTitle />

          <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto font-body">
            Analyze research papers with cutting-edge RAG technology. Get AI summaries, detect patterns, and ask questions — all grounded in your document.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <button onClick={() => onNavigate(userName ? 'upload' : 'login')}
              className="bg-mint text-black px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-mint-dim transition-all mint-glow-hover transform hover:scale-105">
              Analyze Paper →
            </button>
            {userName && (
              <button onClick={() => onNavigate('dashboard')}
                className="glass-card px-8 py-3.5 rounded-xl text-base font-medium text-gray-300 hover:text-white hover:border-white/20 transition-all">
                View Dashboard
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 -mt-4 px-6">
        <div className="max-w-4xl mx-auto glass-card p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((s, i) => (
              <AnimatedCounter key={i} value={s.value} label={s.label} />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-secondary relative noise-overlay">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <h2 className="font-display text-4xl font-bold text-white mb-3">Powerful Features</h2>
            <p className="text-gray-500">Everything you need for comprehensive research analysis</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <div key={i}
                onMouseEnter={() => setHoveredFeature(i)}
                onMouseLeave={() => setHoveredFeature(null)}
                className={`bg-card border border-white/5 ${f.border} rounded-2xl p-6 transition-all duration-300 cursor-pointer ${hoveredFeature === i ? 'transform -translate-y-1 shadow-lg shadow-white/5' : ''}`}>
                <div className={`w-12 h-12 bg-gradient-to-br ${f.gradient} rounded-xl flex items-center justify-center mb-4 text-2xl`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/5 text-center mt-12">
        <p className="text-xs text-gray-600">Built by Sanjeevni Dhir — GenAI Engineer | SRM University Delhi-NCR</p>
      </footer>
    </motion.div>
  );
};

export default HomePage;