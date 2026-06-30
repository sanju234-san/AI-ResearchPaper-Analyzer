import React, { useState, useEffect } from 'react';
import { Upload, Search, BookOpen, BarChart3, Settings, LogOut, User, RefreshCw, Database, FileText, BarChart2, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import TechBadge from '../components/TechBadge';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://paperlytics-65uw.onrender.com';

const DashboardPage = ({ onNavigate, onViewAnalysis, userName }) => {
  const [papers, setPapers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState('local'); // 'local' or 'mongodb'
  const [fetchError, setFetchError] = useState(null);

  const fetchFromMongoDB = async () => {
    const token = document.cookie.split('; ').find(cookie => cookie.startsWith('auth_token='))?.split('=')[1];
    if (!token) return null;

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/papers`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) return null;
      const data = await res.json();
      if (data.success && data.papers) {
        return data.papers.map(p => ({
          id: p.id || p.doc_id,
          doc_id: p.doc_id,
          title: p.filename ? p.filename.replace(/\.[^/.]+$/, "") : 'Untitled',
          filename: p.filename,
          authors: p.user_email || 'Unknown',
          dateUploaded: p.created_at ? new Date(p.created_at).toLocaleDateString() : 'Unknown',
          status: 'Completed',
          textLength: p.text_length || 0,
          extractedText: p.extracted_text || '',
          summary: p.summary || '',
          keywords: p.keywords || [],
          ragStats: p.rag_stats || {},
          plagiarism: p.plagiarism || null,
          answer: p.answer || null,
        }));
      }
    } catch (err) {
      console.error('Failed to fetch papers from MongoDB:', err);
      setFetchError('Could not connect to database');
    }
    return null;
  };

  useEffect(() => {
    const loadPapers = async () => {
      setLoading(true);
      setFetchError(null);

      // Try MongoDB first
      const mongoPapers = await fetchFromMongoDB();
      if (mongoPapers && mongoPapers.length > 0) {
        setPapers(mongoPapers);
        setSource('mongodb');
      } else {
        // Fall back to localStorage
        const localPapers = JSON.parse(localStorage.getItem('papers') || '[]');
        setPapers(localPapers);
        setSource('local');
      }
      setLoading(false);
    };
    loadPapers();
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    setFetchError(null);
    const mongoPapers = await fetchFromMongoDB();
    if (mongoPapers && mongoPapers.length > 0) {
      setPapers(mongoPapers);
      setSource('mongodb');
    } else {
      const localPapers = JSON.parse(localStorage.getItem('papers') || '[]');
      setPapers(localPapers);
      setSource('local');
    }
    setLoading(false);
  };

  const handleDelete = (id) => {
    if (source === 'local') {
      const updated = papers.filter(p => p.id !== id);
      setPapers(updated);
      localStorage.setItem('papers', JSON.stringify(updated));
    }
  };

  const filtered = papers.filter(p =>
    (p.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.authors || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.filename || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalWords = papers.reduce((s, p) => s + (p.extractedText ? p.extractedText.split(/\s+/).length : Math.round((p.textLength || 0) / 5)), 0);

  // Generate chart data for the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toLocaleDateString();
  });
  
  const chartData = last7Days.map(date => {
    return {
      date: date.substring(0, 5), // short date
      count: papers.filter(p => new Date(p.dateUploaded).toLocaleDateString() === date).length
    };
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-mint/30 border-t-mint rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading papers...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="min-h-screen bg-primary flex"
    >
      {/* Sidebar */}
      <aside className="w-60 bg-[#0d0d0d] border-r border-white/5 flex flex-col">
        <div className="p-5 border-b border-white/5">
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-mint/10 border border-mint/30 rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-mint" />
            </div>
            <span className="font-display text-lg font-bold text-white">Paperlytics</span>
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-2.5 bg-mint/10 text-mint rounded-lg text-sm border-l-2 border-mint">
            <BarChart3 className="w-4 h-4" /> Dashboard
          </button>
          <button onClick={() => onNavigate('upload')} className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-500 hover:text-gray-300 hover:bg-white/5 rounded-lg text-sm transition-all">
            <Upload className="w-4 h-4" /> Upload
          </button>
          <button onClick={() => onNavigate('settings')} className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-500 hover:text-gray-300 hover:bg-white/5 rounded-lg text-sm transition-all">
            <Settings className="w-4 h-4" /> Settings
          </button>
        </nav>

        <div className="p-3 border-t border-white/5">
          <div className="px-3 py-2 mb-2">
            <TechBadge label="Powered by AI" color="mint" />
          </div>
          <button onClick={() => onNavigate('logout')} className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-500 hover:text-red-400 hover:bg-white/5 rounded-lg text-sm transition-all">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold text-white mb-1">My Research Papers</h1>
              <div className="flex items-center gap-3">
                <p className="text-gray-500 text-sm">{papers.length} paper{papers.length !== 1 ? 's' : ''} analyzed</p>
                <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                  <Database className="w-3 h-3" />
                  <span className={source === 'mongodb' ? 'text-mint' : 'text-amber'}>{source === 'mongodb' ? 'MongoDB' : 'Local'}</span>
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={handleRefresh} className="p-2 text-gray-500 hover:text-mint hover:bg-white/5 rounded-lg transition-all" title="Refresh">
                <RefreshCw className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-400">{userName || 'Guest'}</span>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-mint/30 to-purple/30 border border-white/10 flex items-center justify-center text-sm font-semibold text-white">
                {(userName || 'G').charAt(0).toUpperCase()}
              </div>
            </div>
          </div>

          {fetchError && (
            <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400 text-sm">
              ⚠️ {fetchError} — showing locally cached papers
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              ['Total Papers', papers.length, <FileText className="w-5 h-5 text-mint" />],
              ['Words Analyzed', totalWords.toLocaleString(), <BarChart2 className="w-5 h-5 text-amber" />],
              ['Avg Similarity', papers.length > 0 ? `${papers.reduce((s, p) => s + (p.plagiarism?.score || 0), 0) / papers.length || 0}%` : '0%', <ShieldAlert className="w-5 h-5 text-purple" />],
            ].map(([label, val, icon]) => (
              <div key={label} className="glass-card p-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex items-center justify-center p-1.5 rounded-lg bg-white/5 border border-white/10">
                    {icon}
                  </div>
                  <span className="text-xs text-gray-500 font-medium">{label}</span>
                </div>
                <div className="text-xl font-mono font-bold text-white">{val}</div>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="glass-card p-6 mb-6">
            <h2 className="text-lg font-display font-bold text-white mb-4">Activity (Last 7 Days)</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="date" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  />
                  <Bar dataKey="count" fill="#6EE7B7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Search + Upload */}
          <div className="flex gap-3 mb-6">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
              <input type="text" placeholder="Search papers..." value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-secondary border border-white/10 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-mint focus:ring-1 focus:ring-mint/30 transition-all" />
            </div>
            <button onClick={() => onNavigate('upload')}
              className="bg-mint text-black px-5 py-3 rounded-xl text-sm font-semibold hover:bg-mint-dim transition-all flex items-center gap-2 mint-glow-hover">
              <Upload className="w-4 h-4" /> Upload New
            </button>
          </div>

          {/* Table */}
          {filtered.length === 0 ? (
            <div className="glass-card p-16 text-center">
              <BookOpen className="w-12 h-12 text-gray-700 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-1">No papers found</h3>
              <p className="text-gray-500 text-sm mb-4">{searchTerm ? 'Try a different search' : 'Upload your first paper'}</p>
              {!searchTerm && (
                <button onClick={() => onNavigate('upload')} className="bg-mint text-black px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-mint-dim transition-all">
                  Upload Paper
                </button>
              )}
            </div>
          ) : (
            <div className="bg-secondary rounded-2xl overflow-hidden border border-white/5">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#0d0d0d]">
                    {['Paper Title', 'Date', 'Plagiarism', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider font-body">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((paper) => (
                    <tr key={paper.id || paper.doc_id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-white">{paper.title}</div>
                        {paper.filename && <div className="text-xs text-gray-600 font-mono mt-0.5">{paper.filename}</div>}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">{paper.dateUploaded}</td>
                      <td className="px-6 py-4">
                        {paper.plagiarism?.score != null ? (
                          <span className={`text-sm font-mono ${paper.plagiarism.score > 50 ? 'text-red-400' : paper.plagiarism.score > 25 ? 'text-amber' : 'text-mint'}`}>
                            {paper.plagiarism.score}%
                          </span>
                        ) : (
                          <span className="text-xs text-gray-600">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4"><TechBadge label={paper.status || 'Completed'} color="mint" /></td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button onClick={() => onViewAnalysis?.(paper)} className="text-mint text-sm hover:text-mint-dim transition-colors">View</button>
                          {source === 'local' && (
                            <button onClick={() => handleDelete(paper.id)} className="text-red-400/70 text-sm hover:text-red-400 transition-colors">Delete</button>
                          )}
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
    </motion.div>
  );
};

export default DashboardPage;