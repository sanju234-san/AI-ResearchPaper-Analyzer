import React, { useState, useEffect } from 'react';
import { BookOpen, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const LoginPage = ({ onLogin, onNavigate }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Auto-login if token exists
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('auth_user');
    if (token && user) {
      try {
        const parsed = JSON.parse(user);
        onLogin(parsed.name || parsed.email);
      } catch {}
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }
    if (!isLogin && !formData.name) {
      setError('Please enter your full name');
      return;
    }

    setIsLoading(true);
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : { email: formData.email, password: formData.password, name: formData.name };

      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || `${isLogin ? 'Login' : 'Signup'} failed`);
      }

      if (data.success && data.token) {
        // Store auth token and user info in localStorage
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('auth_user', JSON.stringify(data.user));
        onLogin(data.user.name || data.user.email);
      } else {
        throw new Error('Unexpected response from server');
      }
    } catch (err) {
      console.error('Auth error:', err);
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        setError('Cannot connect to server. Make sure the backend is running on port 8000.');
      } else {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4 relative noise-overlay">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-mint/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative w-full max-w-md z-10 animate-slide-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-mint/10 border border-mint/30 rounded-2xl mb-4">
            <BookOpen className="w-7 h-7 text-mint" />
          </div>
          <h1 className="font-display text-3xl font-bold text-white mb-2">AI Research Analyzer</h1>
          <p className="text-muted text-sm">Powered by AI</p>
        </div>

        <div className="glass-card p-8">
          <div className="flex gap-1 mb-6 bg-white/5 p-1 rounded-lg">
            {['Login', 'Sign Up'].map((label, i) => (
              <button key={label} onClick={() => { setIsLogin(i === 0); setError(null); }}
                className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-all ${
                  (i === 0 ? isLogin : !isLogin) ? 'bg-mint/10 text-mint border border-mint/20' : 'text-gray-500 hover:text-gray-300'
                }`}>{label}</button>
            ))}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-secondary border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-mint focus:ring-1 focus:ring-mint/30 transition-all"
                  placeholder="Sanjeevni Dhir" required={!isLogin} disabled={isLoading} />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
              <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 bg-secondary border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-mint focus:ring-1 focus:ring-mint/30 transition-all"
                placeholder="you@example.com" required disabled={isLoading} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-4 py-3 bg-secondary border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-mint focus:ring-1 focus:ring-mint/30 transition-all"
                  placeholder="••••••••" required disabled={isLoading} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={isLoading}
              className="w-full bg-mint text-black py-3 rounded-lg font-semibold hover:bg-mint-dim transition-all mint-glow-hover disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {isLogin ? 'Logging in...' : 'Creating account...'}
                </>
              ) : (
                isLogin ? 'Login' : 'Create Account'
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
            <div className="relative flex justify-center text-xs"><span className="px-3 bg-card text-gray-500">Or continue as guest</span></div>
          </div>

          <button onClick={() => {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
            onNavigate('home');
          }} className="w-full border border-white/10 text-gray-300 py-3 rounded-lg font-medium hover:bg-white/5 transition-all">
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
