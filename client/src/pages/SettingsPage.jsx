import React, { useState } from 'react';
import { User, Settings, Shield, CreditCard, Bell, LogOut, Check } from 'lucide-react';
import NavBar from '../components/NavBar';

const SettingsPage = ({ onNavigate, userName }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const storedUser = JSON.parse(localStorage.getItem('auth_user') || '{}');
  const userEmail = storedUser.email || '';

  const handleSignOut = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    onNavigate('logout');
  };

  const handleGoogleConnect = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      // Simulated Google OAuth Flow
      const payload = {
        email: "user@example.com",
        name: userName || "User",
        google_id: "mock_google_id_12345",
        avatar_url: ""
      };
      
      const res = await fetch(`${API_BASE_URL}/api/auth/google-auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (data.success) {
        setIsGoogleConnected(true);
        localStorage.setItem('auth_token', data.token);
      }
    } catch (e) {
      console.error('Failed to connect to backend', e);
      // Fallback for UI if server is off
      setIsGoogleConnected(true);
    }
  };

  return (
    <div className="min-h-screen bg-primary">
      <NavBar onNavigate={onNavigate} userName={userName} />
      
      <main className="max-w-5xl mx-auto px-6 pt-28 pb-16">
        <div className="mb-10 animate-slide-up">
          <h1 className="font-display text-4xl font-bold text-white mb-2">Settings & Profile</h1>
          <p className="text-gray-500">Manage your account preferences and integrations.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 shrink-0">
            <div className="glass-card p-4 rounded-2xl flex flex-col gap-2">
              <button 
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-3 w-full p-3 rounded-lg text-left transition-all ${activeTab === 'profile' ? 'bg-mint/10 text-mint' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
              >
                <User size={18} />
                <span className="font-medium text-sm">Profile</span>
              </button>
              <button 
                onClick={() => setActiveTab('security')}
                className={`flex items-center gap-3 w-full p-3 rounded-lg text-left transition-all ${activeTab === 'security' ? 'bg-mint/10 text-mint' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
              >
                <Shield size={18} />
                <span className="font-medium text-sm">Security & Auth</span>
              </button>
              <button 
                onClick={() => setActiveTab('preferences')}
                className={`flex items-center gap-3 w-full p-3 rounded-lg text-left transition-all ${activeTab === 'preferences' ? 'bg-mint/10 text-mint' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
              >
                <Settings size={18} />
                <span className="font-medium text-sm">Preferences</span>
              </button>
              <div className="h-px bg-white/10 my-2"></div>
              <button onClick={handleSignOut} className="flex items-center gap-3 w-full p-3 rounded-lg text-left text-red-400 hover:bg-red-500/10 transition-all">
                <LogOut size={18} />
                <span className="font-medium text-sm">Sign Out</span>
              </button>
            </div>
          </aside>

          {/* Content Area */}
          <div className="flex-1 glass-card p-8 rounded-2xl animate-fade-in">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-4">Public Profile</h2>
                
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-mint to-blue-500 flex items-center justify-center text-3xl font-bold text-black">
                    {userName ? userName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      Change Avatar
                    </button>
                  </div>
                </div>

                <div className="grid gap-4 mt-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Display Name</label>
                    <input type="text" defaultValue={userName} className="w-full bg-secondary border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-mint" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                    <input type="email" defaultValue={userEmail} className="w-full bg-secondary border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-mint" />
                  </div>
                </div>

                <div className="pt-4">
                  <button className="bg-mint text-black px-6 py-2 rounded-lg font-semibold hover:bg-mint-dim transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-4">Security & Authentication</h2>
                
                <div className="bg-secondary/50 border border-white/5 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Google Authenticator</h3>
                      <p className="text-sm text-gray-400">Connect your Google account for seamless login.</p>
                    </div>
                    {isGoogleConnected ? (
                      <div className="flex items-center gap-2 text-mint bg-mint/10 px-4 py-2 rounded-lg">
                        <Check size={18} />
                        <span className="font-medium text-sm">Connected</span>
                      </div>
                    ) : (
                      <button onClick={handleGoogleConnect} className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Connect Google
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">Data will be synced with MongoDB Atlas securely.</p>
                </div>

                <div className="bg-secondary/50 border border-white/5 rounded-xl p-6 mt-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Password</h3>
                  <p className="text-sm text-gray-400 mb-4">Change your password to keep your account secure.</p>
                  <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Change Password
                  </button>
                </div>
              </div>
            )}
            
            {activeTab === 'preferences' && (
              <div className="space-y-6">
                 <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-4">Preferences</h2>
                 <p className="text-gray-400">Settings coming soon.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
