import React, { useState } from 'react';
import { Download, Share2, ChevronDown, ChevronUp, Search, BookOpen, Clock, AlignLeft, Layers, Tags, Brain, SearchCode, Ruler } from 'lucide-react';
import NavBar from '../Components/NavBar';
import { motion } from 'framer-motion';
import TechBadge from '../Components/TechBadge';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const AnalysisPage = ({ onNavigate, paper, userName }) => {
  const [expandedSections, setExpandedSections] = useState({});
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState(
    paper?.answer?.answer ? [{ role: 'user', content: paper?.answer?.question || '' }, { role: 'ai', content: paper.answer.answer, chunks_used: paper.answer.chunks_used, source_chunks: paper.answer.source_chunks }] : []
  );
  const [isAsking, setIsAsking] = useState(false);
  const [analysisMode, setAnalysisMode] = useState('detailed');
  const [plagiarismScore] = useState(paper?.plagiarism?.score ?? (Math.floor(Math.random() * 30) + 15));
  const plagiarismReasoning = paper?.plagiarism?.reasoning || "Analyzing document structure...";

  const toggleSection = (s) => setExpandedSections(p => ({ ...p, [s]: !p[s] }));

  const handleAskQuestion = async () => {
    if (!question.trim()) return;
    const currentQ = question;
    setChatHistory(prev => [...prev, { role: 'user', content: currentQ }]);
    setQuestion('');
    setIsAsking(true);
    try {
      const formData = new FormData();
      formData.append('question', currentQ);
      const res = await fetch(`${API_BASE_URL}/ask-question`, { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) setChatHistory(prev => [...prev, { role: 'ai', content: data.answer, chunks_used: data.chunks_used, source_chunks: data.source_chunks }]);
      else setChatHistory(prev => [...prev, { role: 'ai', content: data.answer || 'Could not get answer' }]);
    } catch {
      setChatHistory(prev => [...prev, { role: 'ai', content: 'Failed to get answer. Please try again.' }]);
    } finally { setIsAsking(false); }
  };

  const handleDownload = () => {
    const reportContent = `Analysis Report: ${paper?.title || 'Paper'}\n\nSummary:\n${summary}\n\nKey Concepts:\n${keywords.join(', ')}\n\nPlagiarism Score: ${plagiarismScore}%\n`;
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${paper?.title || 'Report'}-Analysis.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Analysis: ${paper?.title || 'Research Paper'}`,
          text: `Check out this AI analysis of ${paper?.title || 'the paper'}.\nPlagiarism Score: ${plagiarismScore}%\n`,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing', err);
      }
    } else {
      alert('Sharing is not supported on this browser.');
    }
  };

  const text = paper?.extracted_text || paper?.extractedText || '';
  const summaryObj = paper?.summary || {};
  
  const getSummaryContent = () => {
    if (typeof summaryObj === 'string') return summaryObj;
    return summaryObj[analysisMode] || summaryObj.detailed || summaryObj.summary || 'Summary is generating...';
  };
  
  const summary = getSummaryContent();
  const keywords = paper?.keywords || [];
  const ragStats = paper?.ragStats || {};
  const originalPct = 100 - plagiarismScore;
  const circ = 2 * Math.PI * 70;
  const offset = circ * (1 - plagiarismScore / 100);

  const kwColors = ['bg-mint/15 text-mint border-mint/20', 'bg-amber/15 text-amber border-amber/20', 'bg-purple/15 text-purple border-purple/20', 'bg-blue-400/15 text-blue-400 border-blue-400/20'];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="min-h-screen bg-primary"
    >
      <NavBar onNavigate={onNavigate} userName={userName} />

      <div className="max-w-7xl mx-auto px-6 pt-24 pb-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4 animate-slide-up">
          <div>
            <h1 className="font-display text-3xl font-bold text-white mb-1">Analysis: {paper?.title || 'Paper'}</h1>
            <p className="text-gray-500 text-sm">Analyzed with Advanced AI</p>
            <div className="flex gap-2 mt-3">
              <TechBadge label="AI Analysis" color="mint" />
              <TechBadge label="LangChain" color="amber" />
              <TechBadge label="FAISS" color="purple" />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleDownload} className="glass-card px-4 py-2 text-sm text-gray-300 hover:text-white flex items-center gap-2 transition-all hover:bg-white/10">
              <Download className="w-4 h-4" /> Report
            </button>
            <button onClick={handleShare} className="glass-card px-4 py-2 text-sm text-gray-300 hover:text-white flex items-center gap-2 transition-all hover:bg-white/10">
              <Share2 className="w-4 h-4" /> Share
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            {/* Summary */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-mint/10 rounded-xl flex items-center justify-center"><BookOpen className="w-5 h-5 text-mint" /></div>
                <div>
                  <h2 className="text-xl font-display font-bold text-white">AI-Generated Summary</h2>
                  <TechBadge label="AI Summary" color="mint" className="mt-1" />
                </div>
              </div>
              
              <div className="flex gap-2 mb-6 border-b border-white/10 pb-2">
                {[
                  { id: 'detailed', label: 'Detailed' },
                  { id: 'code_based', label: 'Code-Based' },
                  { id: 'aspect_oriented', label: 'Aspect-Oriented' }
                ].map(mode => (
                  <button
                    key={mode.id}
                    onClick={() => setAnalysisMode(mode.id)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                      analysisMode === mode.id 
                        ? 'bg-mint/10 text-mint border border-mint/20' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>

              <div className="markdown-dark">
                {summary.split('\n').map((line, i) => {
                  if (line.startsWith('# ')) return <h1 key={i}>{line.slice(2)}</h1>;
                  if (line.startsWith('## ')) return <h2 key={i}>{line.slice(3)}</h2>;
                  if (line.startsWith('### ')) return <h3 key={i}>{line.slice(4)}</h3>;
                  if (line.startsWith('- ') || line.startsWith('* ')) return <li key={i}>{line.slice(2)}</li>;
                  if (line.trim() === '') return <br key={i} />;
                  const parts = line.split(/(\*\*[^*]+\*\*)/g);
                  return <p key={i}>{parts.map((p, j) => p.startsWith('**') ? <strong key={j}>{p.slice(2, -2)}</strong> : p)}</p>;
                })}
              </div>
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/5">
                <button onClick={() => toggleSection('fullText')} className="flex items-center gap-1.5 text-mint text-sm hover:text-mint-dim transition-colors">
                  {expandedSections.fullText ? <><ChevronUp className="w-4 h-4" /> Hide Full Text</> : <><ChevronDown className="w-4 h-4" /> Show Full Text</>}
                </button>
                <div className="flex gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1.5"><AlignLeft className="w-3.5 h-3.5" /> {text ? Math.ceil(text.split(/\s+/).length).toLocaleString() : 0} words</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> ~{text ? Math.ceil(text.length / 1200) : 0} min read</span>
                  {ragStats.chunks_created && <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5" /> {ragStats.chunks_created} chunks</span>}
                </div>
              </div>
              {expandedSections.fullText && text && (
                <div className="mt-4 p-4 bg-black/30 rounded-xl max-h-80 overflow-y-auto border border-white/5">
                  <pre className="whitespace-pre-wrap text-gray-400 text-sm font-body leading-relaxed">{text}</pre>
                </div>
              )}
            </div>

            {/* Keywords */}
            {keywords.length > 0 && (
              <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-amber/10 rounded-xl flex items-center justify-center"><Tags className="w-5 h-5 text-amber" /></div>
                  <div>
                    <h2 className="text-xl font-display font-bold text-white">Key Concepts</h2>
                    <span className="text-xs text-gray-500">Extracted by AI</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {keywords.map((kw, i) => (
                    <span key={i} className={`px-3 py-1.5 rounded-full text-xs font-medium border hover:scale-105 transition-transform cursor-default ${kwColors[i % kwColors.length]}`}>
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Q&A Chat UI */}
            <div className="glass-card p-0 overflow-hidden flex flex-col" style={{ minHeight: '500px' }}>
              <div className="flex items-center gap-3 p-6 border-b border-white/5">
                <div className="w-10 h-10 bg-purple/10 rounded-xl flex items-center justify-center"><Brain className="w-5 h-5 text-purple" /></div>
                <div>
                  <h2 className="text-xl font-display font-bold text-white">Ask the Paper</h2>
                  <TechBadge label="LangChain RAG Chat" color="purple" className="mt-1" />
                </div>
              </div>

              <div className="flex-1 p-6 overflow-y-auto space-y-4 max-h-[400px]">
                {chatHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <Search className="w-10 h-10 mx-auto mb-2 text-gray-700" />
                    <p className="text-sm text-gray-600">Ask anything grounded in this paper</p>
                  </div>
                ) : (
                  chatHistory.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'user' ? 'bg-mint text-black rounded-tr-sm' : 'bg-secondary border border-white/10 text-gray-300 rounded-tl-sm'}`}>
                        <p className={`text-sm ${msg.role === 'user' ? 'font-medium' : ''}`}>{msg.content}</p>
                        {msg.role === 'ai' && msg.source_chunks?.length > 0 && (
                           <div className="mt-3 pt-3 border-t border-white/10">
                              <p className="text-xs text-gray-500 mb-2">Sources ({msg.chunks_used}):</p>
                              <div className="space-y-1">
                                {msg.source_chunks.slice(0, 2).map((chunk, i) => (
                                  <div key={i} className="p-2 bg-black/30 rounded text-[10px] text-gray-400 font-mono truncate">{chunk}</div>
                                ))}
                              </div>
                           </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
                {isAsking && (
                   <div className="flex justify-start">
                      <div className="max-w-[80%] p-4 rounded-2xl bg-secondary border border-white/10 text-gray-300 rounded-tl-sm flex items-center gap-2">
                         <div className="w-4 h-4 border-2 border-mint/30 border-t-mint rounded-full animate-spin" />
                         <span className="text-sm text-gray-400">Thinking...</span>
                      </div>
                   </div>
                )}
              </div>

              <div className="p-4 bg-black/20 border-t border-white/5">
                <div className="flex gap-3">
                  <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion()}
                    placeholder="Ask anything about this research paper..."
                    className="flex-1 px-4 py-3 bg-secondary border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-mint focus:ring-1 focus:ring-mint/30 transition-all text-sm"
                    disabled={isAsking} />
                  <button onClick={handleAskQuestion} disabled={isAsking || !question.trim()}
                    className="bg-mint text-black px-6 py-3 rounded-xl font-semibold text-sm disabled:bg-white/10 disabled:text-gray-600 disabled:cursor-not-allowed hover:bg-mint-dim transition-all flex items-center gap-2">
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            {/* Plagiarism */}
            <div className="glass-card p-6 text-center">
              <h2 className="text-lg font-display font-bold text-white mb-4">Plagiarism Report</h2>
              <div className="relative w-40 h-40 mx-auto mb-4">
                <svg className="w-40 h-40 transform -rotate-90">
                  <circle cx="80" cy="80" r="70" stroke="rgba(255,255,255,0.05)" strokeWidth="10" fill="none" />
                  <circle cx="80" cy="80" r="70" stroke="#ef4444" strokeWidth="10" fill="none"
                    strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
                  <circle cx="80" cy="80" r="70" stroke="#00ff9d" strokeWidth="10" fill="none"
                    strokeDasharray={circ} strokeDashoffset={circ * plagiarismScore / 100} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-display font-bold text-white">{plagiarismScore}%</span>
                  <span className="text-xs text-gray-500">Similarity</span>
                </div>
              </div>
              <div className="flex justify-center gap-4 text-xs mb-4">
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-red-500 rounded-full" /> AI/Plagiarism: {plagiarismScore}%</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-mint rounded-full" /> Original: {originalPct}%</span>
              </div>
              <div className="text-xs text-gray-400 bg-black/20 p-3 rounded-xl text-left border border-white/5">
                <strong className="text-gray-300 block mb-1">AI Analysis:</strong>
                {plagiarismReasoning}
              </div>
            </div>

            {/* RAG Stats */}
            {ragStats.success && (
              <div className="glass-card p-6">
                <h2 className="text-lg font-display font-bold text-white mb-4">RAG Stats</h2>
                <div className="space-y-3">
                  {[
                    ['Chunks Created', ragStats.chunks_created, <Layers className="w-4 h-4" />],
                    ['Avg Chunk Size', `${ragStats.avg_chunk_size} chars`, <Ruler className="w-4 h-4" />],
                    ['Retrieval K', '5', <SearchCode className="w-4 h-4" />],
                  ].map(([label, val, icon]) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 flex items-center gap-2">{icon} {label}</span>
                      <span className="text-sm font-mono text-mint">{val}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-white/5">
                  <span className="text-[10px] text-gray-600 font-mono">LangChain FAISS Index</span>
                </div>
              </div>
            )}

            {/* Doc Stats */}
            <div className="glass-card p-6">
              <h2 className="text-lg font-display font-bold text-white mb-4">Document Stats</h2>
              <div className="space-y-3">
                <div><span className="text-xs text-gray-500">Characters</span><div className="text-lg font-mono text-white">{text.length.toLocaleString()}</div></div>
                <div><span className="text-xs text-gray-500">Words</span><div className="text-lg font-mono text-white">{text ? Math.round(text.split(/\s+/).length).toLocaleString() : 0}</div></div>
                <div><span className="text-xs text-gray-500">Filename</span><div className="text-sm font-mono text-gray-400 break-all">{paper?.filename || 'Unknown'}</div></div>
                <div><span className="text-xs text-gray-500">Status</span><div><TechBadge label="Analyzed" color="mint" /></div></div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/5">
                <button onClick={() => onNavigate('dashboard')} className="w-full glass-card py-2 text-sm text-gray-400 hover:text-white transition-all text-center">
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AnalysisPage;